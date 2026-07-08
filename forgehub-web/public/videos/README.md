# public/videos

Coloque aqui os vídeos servidos estaticamente (caminho relativo `/videos/arquivo.mp4`).

## hero-avatar.mp4 (slot do Hero)
O Hero da landing já tem o slot pronto apontando para `/videos/hero-avatar.mp4`.
Enquanto o arquivo não existir, o slot mostra automaticamente:
1. `/images/hero-avatar-poster.jpg` (se você adicionar um poster), ou
2. um placeholder de marca ("Vídeo em breve").

Para ativar o vídeo, basta:
1. Subir `hero-avatar.mp4` nesta pasta (recomendado: MP4/H.264, mudo, curto, vertical 3:4).
2. (Opcional) Subir `public/images/hero-avatar-poster.jpg` como pôster/fallback.
3. Commitar e fazer novo deploy — nenhuma mudança de código é necessária.
