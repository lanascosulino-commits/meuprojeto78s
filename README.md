# Bolos que Vendem: página de vendas

Página de vendas (landing page) para um curso online de bolos. É um único arquivo, `index.html`, com HTML, CSS e JavaScript, sem precisar de compilação.

## Como publicar no GitHub Pages

1. No GitHub, vá em **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**.
3. Selecione o branch (ex.: `main`) e a pasta `/ (root)` e clique em **Save**.
4. Em 1 a 2 minutos o site estará em `https://<seu-usuario>.github.io/<nome-do-repositorio>/`.

## O que personalizar antes de divulgar

| O quê | Onde |
|---|---|
| Link do checkout (Hotmart, Kiwify, Eduzz…) | `index.html`, no final do arquivo: `const CHECKOUT_URL = '...'` |
| Preço e parcelamento | `index.html`, seção `#oferta` e o botão fixo `ctaFixo` |
| Nome e história da professora | `index.html`, seção "Quem vai te ensinar" |
| Depoimentos **reais** das alunas | `index.html`, seção "Quem fez, aprovou" |
| Ilustração do bolo no topo | `index.html`, substitua o `<svg>` dentro de `.palco` por uma `<img>` com a sua foto |
| Custo médio por quilo da calculadora | `index.html`, `const CUSTO_KG = 28` |
| Cores e fontes | `index.html`, variáveis em `:root` |

> Use apenas depoimentos, números e prazos verdadeiros: além de ser exigido pelo Código de Defesa do Consumidor, isso evita bloqueios nas plataformas de pagamento e anúncios.

## Chat com a assistente (Groq)

A página tem um botão **"Tire suas dúvidas"** que abre um chat com IA. A chave da Groq **não fica no site**: o GitHub Pages é público e qualquer visitante poderia copiá-la. Ela fica guardada como segredo em um Cloudflare Worker gratuito, que conversa com a Groq em nome do site.

### Como ativar (cerca de 10 minutos, sem instalar nada)

1. Crie uma conta gratuita em https://dash.cloudflare.com.
2. No menu, abra **Workers & Pages → Create → Create Worker**, dê o nome `bolos-chat` e clique em **Deploy**.
3. Clique em **Edit code**, apague o código de exemplo, cole todo o conteúdo de [`worker/groq-chat.js`](worker/groq-chat.js) e clique em **Deploy**.
4. Volte ao Worker e abra **Settings → Variables and Secrets → Add**:
   - Tipo **Secret**, nome `GROQ_API_KEY`, valor: sua chave `gsk_...`
   - Tipo **Text**, nome `ALLOWED_ORIGIN`, valor: `https://lanascosulino-commits.github.io` (assim só o seu site consegue usar o chat)
5. Copie o endereço do Worker (algo como `https://bolos-chat.SEU-USUARIO.workers.dev`).
6. No `index.html`, no final do arquivo, cole esse endereço em `const CHAT_API_URL = '...'`.

O que a assistente sabe sobre o curso (preço, módulos, garantia) está no início de `worker/groq-chat.js`, em `SYSTEM_PROMPT`. Se mudar algo no curso, atualize ali também.

> Nunca coloque a chave `gsk_...` no `index.html` nem em nenhum arquivo do repositório.
