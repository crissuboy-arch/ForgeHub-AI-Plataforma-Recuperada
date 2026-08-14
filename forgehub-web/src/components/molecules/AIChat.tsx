'use client';

import { useState } from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import { Input } from '../atoms/Input';

interface AIChatProps {
  initialQuestion?: string;
  onResponse?: (response: string) => void;
  compact?: boolean;
}

export function AIChat({ initialQuestion = '', onResponse, compact = false }: AIChatProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const askAI = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Tentar NVIDIA API primeiro
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      
      if (!res.ok) throw new Error('Falha na resposta da API');
      
      const data = await res.json();
      setResponse(data.response || data.answer || 'Resposta recebida');
      
      if (onResponse) {
        onResponse(data.response || data.answer);
      }
    } catch (err) {
      setError('Erro ao consultar IA. Tente novamente.');
      console.error('AI Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Pergunte algo..."
            className="flex-1"
          />
          <Button onClick={askAI} disabled={loading || !question.trim()}>
            <Icon name={loading ? 'spinner' : 'send'} size={14} />
          </Button>
        </div>
        {response && (
          <div className="rounded border border-border bg-card p-3 text-sm">
            <Typography variant="small">{response}</Typography>
          </div>
        )}
        {error && <Typography variant="small" className="text-danger">{error}</Typography>}
      </div>
    );
  }

  return (
    <div className="rounded-container border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <Icon name="brain" size={20} className="text-brand" />
        <Typography variant="h5">Assistente IA</Typography>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-content">
            Sua pergunta
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: Gere um slug para 'Curso de Marketing Digital Avançado'"
            className="w-full rounded border border-border bg-background p-3 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            rows={3}
          />
        </div>
        
        <Button 
          onClick={askAI} 
          disabled={loading || !question.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Icon name="spinner" size={16} className="animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Icon name="send" size={16} />
              Perguntar à IA
            </>
          )}
        </Button>
        
        {response && (
          <div className="rounded border border-border bg-success/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Icon name="check" size={16} className="text-success" />
              <Typography variant="small" className="font-semibold text-success">
                Resposta da IA
              </Typography>
            </div>
            <Typography variant="p" className="text-content">
              {response}
            </Typography>
            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(response)}
              >
                <Icon name="copy" size={14} />
                Copiar
              </Button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="rounded border border-danger/20 bg-danger/5 p-3">
            <Typography variant="small" className="text-danger">
              {error}
            </Typography>
          </div>
        )}
      </div>
      
      <div className="mt-4 border-t border-border pt-4">
        <Typography variant="small" className="text-dim">
          <Icon name="info" size={12} className="mr-1 inline" />
          Use para: gerar slugs, descrições, tags, nomes criativos ou tirar dúvidas.
        </Typography>
      </div>
    </div>
  );
}