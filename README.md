# Bolos que Vendem: página de vendas

Página de vendas (landing page) para um curso online de bolos, feita em HTML e CSS puros, sem precisar de compilação.

## Como publicar no GitHub Pages

1. No GitHub, vá em **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Selecione o branch (ex.: `main`) e a pasta `/ (root)` e clique em **Save**.
4. Em 1 a 2 minutos o site estará em `https://<seu-usuario>.github.io/<nome-do-repositorio>/`.

## O que personalizar antes de divulgar

| O quê | Onde |
|---|---|
| Link do checkout (Hotmart, Kiwify, Eduzz…) | `index.html`, procure `SEU-LINK-DE-CHECKOUT` |
| Preço e parcelamento | `index.html`, seção `#oferta`, e o botão fixo `stickyCta` |
| Nome e história da professora | `index.html`, seção "Quem vai te ensinar" |
| Depoimentos **reais** das alunas | `index.html`, seção "Quem fez, aprovou" |
| Foto do bolo no topo | `index.html`, substitua o bloco `.cake` por uma `<img>` |
| Cores | `style.css`, variáveis em `:root` |

> Use apenas depoimentos, números e prazos verdadeiros: além de ser exigido pelo Código de Defesa do Consumidor, isso evita bloqueios nas plataformas de pagamento e anúncios.
