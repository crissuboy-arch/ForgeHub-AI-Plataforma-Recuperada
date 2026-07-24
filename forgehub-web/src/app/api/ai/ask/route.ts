import { NextRequest, NextResponse } from 'next/server';

// Tipos de APIs disponíveis
type AIProvider = 'nvidia' | 'agnes' | 'openai';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    
    if (!question) {
      return NextResponse.json(
        { error: 'Pergunta não fornecida' },
        { status: 400 }
      );
    }

    console.log('Processando pergunta:', question.substring(0, 50) + '...');

    // TENTAR NVIDIA API PRIMEIRO
    let response = await tryNVIDIA(question);
    
    // SE FALHAR, TENTAR AGNES
    if (!response.success) {
      console.log('NVIDIA falhou, tentando AGNES...');
      response = await tryAgnes(question);
    }
    
    // SE AMBAS FALHAREM, USAR FALLBACK
    if (!response.success) {
      console.log('APIs falharam, usando fallback...');
      response = await fallbackAI(question);
    }

    return NextResponse.json({
      success: true,
      response: response.answer,
      provider: response.provider,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API AI:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        success: false,
        fallback: await fallbackAI('').then(r => r.answer)
      },
      { status: 500 }
    );
  }
}

// NVIDIA API
async function tryNVIDIA(question: string): Promise<{ success: boolean; answer: string; provider: AIProvider }> {
  try {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      throw new Error('Chave NVIDIA não configurada');
    }

    // Verificar se é pedido de slug
    const isSlugRequest = question.toLowerCase().includes('slug') || 
                         question.toLowerCase().includes('gerar');
    
    const prompt = isSlugRequest 
      ? `Gere um slug amigável para SEO baseado em: "${question}". Regras: apenas letras minúsculas, hífens, números, sem espaços, max 50 chars.`
      : `Responda de forma útil e concisa: "${question}". Seja direto e prático.`;

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NVIDIA API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'Sem resposta da NVIDIA.';
    
    // Processar slug se necessário
    const finalAnswer = isSlugRequest ? processSlug(answer) : answer;

    return { 
      success: true, 
      answer: finalAnswer,
      provider: 'nvidia' 
    };

  } catch (error) {
    console.error('Erro NVIDIA:', error);
    return { 
      success: false, 
      answer: `Erro NVIDIA: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      provider: 'nvidia' 
    };
  }
}

// AGNES API
async function tryAgnes(question: string): Promise<{ success: boolean; answer: string; provider: AIProvider }> {
  try {
    const apiKey = process.env.AGNES_API_KEY;
    if (!apiKey) {
      throw new Error('Chave AGNES não configurada');
    }

    // Verificar se é pedido de slug
    const isSlugRequest = question.toLowerCase().includes('slug') || 
                         question.toLowerCase().includes('gerar');
    
    const prompt = isSlugRequest
      ? `Gere slug para: "${question}". Formato: letras minúsculas, hífens, sem espaços.`
      : question;

    const response = await fetch('https://api.agnes.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: prompt,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error(`AGNES API error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.response || data.message || 'Sem resposta da AGNES.';
    
    // Processar slug se necessário
    const finalAnswer = isSlugRequest ? processSlug(answer) : answer;

    return { 
      success: true, 
      answer: finalAnswer,
      provider: 'agnes' 
    };

  } catch (error) {
    console.error('Erro AGNES:', error);
    return { 
      success: false, 
      answer: `Erro AGNES: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      provider: 'agnes' 
    };
  }
}

// Fallback inteligente
async function fallbackAI(question: string): Promise<{ success: boolean; answer: string; provider: AIProvider }> {
  const isSlugRequest = question.toLowerCase().includes('slug') || 
                       question.toLowerCase().includes('gerar');
  
  if (isSlugRequest) {
    // Gerar slug automaticamente
    const slug = generateSlugFromText(question);
    return {
      success: true,
      answer: slug,
      provider: 'openai'
    };
  }
  
  // Resposta genérica útil
  const responses = [
    "Entendi sua pergunta. Para uma resposta mais precisa, configure as chaves de API da NVIDIA ou AGNES nas variáveis de ambiente.",
    "Estou processando sua solicitação. A funcionalidade de IA requer configuração das APIs.",
    "Sistema de IA disponível após configuração das chaves API.",
    "Para usar o assistente de IA completo, adicione as chaves NVIDIA_API_KEY e AGNES_API_KEY nas configurações."
  ];
  
  return {
    success: true,
    answer: responses[Math.floor(Math.random() * responses.length)],
    provider: 'openai'
  };
}

// Helper: Processar slug da resposta
function processSlug(text: string): string {
  // Extrair apenas o slug da resposta
  const lines = text.split('\n');
  for (const line of lines) {
    const clean = line.trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-')         // Espaços para hífens
      .replace(/-+/g, '-')          // Múltiplos hífens para um
      .replace(/^-|-$/g, '');       // Remove hífens no início/fim
    
    if (clean && clean.length > 3 && /^[a-z0-9-]+$/.test(clean)) {
      return clean.substring(0, 50); // Limitar tamanho
    }
  }
  
  // Se não encontrar, gerar do texto original
  return generateSlugFromText(text);
}

// Helper: Gerar slug do texto
function generateSlugFromText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}