# toyalimalvl — diário visual

Um diário visual pessoal, feito à mão para a Letícia. Não é uma rede social —
é um mural, um scrapbook moderno, um editorial guardado a dois cliques de distância.

## Estrutura

```
index.html
assets/
  css/style.css     → todo o sistema visual (cores, tipografia, grid, animações)
  js/main.js        → loading screen, fade-in no scroll, easter egg do username
  images/           → coloque aqui as fotos reais (001.jpg, 002.jpg, ...)
  videos/           → coloque aqui os vídeos (001.mp4, ...)
```

As fotos do mural atual usam imagens de placeholder (picsum.photos) só para
visualização. Troque pelos arquivos reais em `assets/images/`.

## Como adicionar uma foto nova

Cole isto dentro de `<main class="mural">`, em qualquer lugar:

```html
<div class="post">
  <img src="assets/images/006.jpg">
</div>
```

Opcionalmente, com legenda:

```html
<div class="post">
  <img src="assets/images/006.jpg">
  <p class="post-caption">sua legenda aqui</p>
</div>
```

## Como adicionar um vídeo novo

```html
<div class="post video">
  <video autoplay muted loop playsinline>
    <source src="assets/videos/002.mp4" type="video/mp4">
  </video>
</div>
```

Não é necessário mexer em CSS ou JavaScript. O mural é um masonry em CSS puro
(`column-width`), então ele se reorganiza sozinho conforme você adiciona ou
remove itens — em qualquer tamanho de tela.

## Cartões do mural

Os pequenos cartões (favorite color, favorite place, favorite pattern, late
night drives) seguem o mesmo padrão de `.post`, só que com a classe `card`:

```html
<div class="post card">
  <span class="card-label">nome do cartão</span>
  <span class="card-value">valor</span>
</div>
