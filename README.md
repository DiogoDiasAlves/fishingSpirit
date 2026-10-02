# Fishing Spirit · E-commerce

Loja virtual de iscas, varas, molinetes, linhas e acessórios de pesca, com a identidade visual da Fishing Spirit (azul elétrico, preto e prata).

Site estático (HTML + CSS + JavaScript puro), sem build.

## Publicação (Cloudflare)

Publicado como Worker com arquivos estáticos. O projeto está ligado ao GitHub: cada push roda `npx wrangler deploy`, que envia a pasta `public/` (veja `wrangler.jsonc`).

## Rodar localmente

```bash
npx serve public
# ou
python3 -m http.server 8080 -d public
```

Depois abra http://localhost:8080 (ou só dê dois cliques em `public/index.html`).

## O que tem

- Topo com a logo, busca e carrinho; menu de categorias
- Destaque (hero) com a logo e chamadas simples
- Categorias, vitrine com filtros, ordenação e busca
- "Escolha pelo peixe": tucunaré, robalo, traíra, dourado, pesqueiro
- Detalhe do produto com preço no Pix, parcelamento, cores e especificações
- Carrinho lateral salvo no navegador, com barra de frete grátis (R$ 299)
- Checkout demonstrativo (Pix 5% off, cartão, boleto). **Não processa pagamento.**
- Banner de kit, depoimentos, newsletter, rodapé
- Layout responsivo (celular, tablet e desktop)

## Estrutura

```
public/                           tudo que vai pro ar
  index.html                      página da loja
  css/style.css                   estilos (cores da marca em :root)
  js/products.js                  catálogo: produtos, categorias e espécies
  js/app.js                       filtros, carrinho, modal e checkout
  assets/img/logo.png             logo com fundo transparente
  assets/img/products/*.svg       imagens ilustrativas dos produtos
scripts/generate-product-images.mjs  gera as ilustrações
wrangler.jsonc                    configuração da Cloudflare
```

## Editar produtos

Tudo fica em `public/js/products.js`. Para trocar a imagem fictícia pela foto real, coloque a foto em `public/assets/img/products/` e mude o campo `image` do produto.

## Próximos passos para vender de verdade

- Ligar o checkout a um meio de pagamento (Mercado Pago, Pagar.me, Stripe…) ou migrar o catálogo para Shopify / Nuvemshop
- Trocar o número de WhatsApp no `index.html` (`wa.me/5500000000000`)
- Calcular frete real pelo CEP (Correios / Melhor Envio)
