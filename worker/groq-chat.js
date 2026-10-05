// Cloudflare Worker: ponte segura entre o chat do site e a API da Groq.
// A chave fica guardada como segredo no Cloudflare (GROQ_API_KEY) e nunca vai para o navegador.
//
// Variáveis do Worker:
//   GROQ_API_KEY   (segredo, obrigatório)  sua chave gsk_...
//   ALLOWED_ORIGIN (opcional)              ex.: https://lanascosulino-commits.github.io
//   GROQ_MODEL     (opcional)              padrão: llama-3.3-70b-versatile

const SYSTEM_PROMPT = `Você é a assistente virtual do curso online "Bolos que Vendem".
Responda sempre em português do Brasil, de forma simpática, curta (no máximo 4 frases) e objetiva.
Seu objetivo é tirar dúvidas e ajudar a pessoa a decidir pela compra, sem pressão e sem inventar informações.

Fatos do curso:
- Curso online de confeitaria, do zero às primeiras encomendas.
- 6 módulos e 48 aulas em vídeo (cerca de 8h42min): Fundamentos; Massas que não falham; Recheios e caldas; Montagem e estrutura; Decoração profissional; Do hobby ao negócio (precificação, cardápio, fotos, Instagram e WhatsApp).
- Bônus: Planilha de Precificação, 30 Receitas de Bolo de Pote, Scripts de Venda no WhatsApp.
- Preço: 12x de R$ 9,74 ou R$ 97 à vista no Pix. Pagamento por Pix, cartão ou boleto.
- Acesso por 1 ano, certificado de conclusão e suporte para dúvidas.
- Garantia incondicional de 7 dias com reembolso de 100%.
- Não precisa de experiência nem de equipamentos caros.

Regras:
- Se não souber algo, diga que não tem essa informação e sugira falar com o suporte.
- Nunca prometa valores de ganho garantidos.
- Quando fizer sentido, convide a pessoa a garantir a vaga na seção de oferta da página.`;

const MAX_MENSAGENS = 12;
const MAX_CARACTERES = 1500;

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors(origin) },
  });
}

export default {
  async fetch(request, env) {
    const permitido = env.ALLOWED_ORIGIN || '*';
    const origem = request.headers.get('Origin') || '';
    const origemResposta = permitido === '*' ? '*' : permitido;

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origemResposta) });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Use POST.' }, 405, origemResposta);
    }
    if (permitido !== '*' && origem !== permitido) {
      return json({ error: 'Origem não permitida.' }, 403, origemResposta);
    }
    if (!env.GROQ_API_KEY) {
      return json({ error: 'GROQ_API_KEY não configurada no Worker.' }, 500, origemResposta);
    }

    let dados;
    try {
      dados = await request.json();
    } catch {
      return json({ error: 'JSON inválido.' }, 400, origemResposta);
    }

    const historico = Array.isArray(dados.messages) ? dados.messages : [];
    const mensagens = historico
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-MAX_MENSAGENS)
      .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CARACTERES) }));

    if (!mensagens.length || mensagens[mensagens.length - 1].role !== 'user') {
      return json({ error: 'Envie ao menos uma mensagem do usuário.' }, 400, origemResposta);
    }

    const resposta = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...mensagens],
        temperature: 0.6,
        max_tokens: 400,
      }),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error('Groq', resposta.status, detalhe);
      return json({ error: 'A assistente está indisponível no momento. Tente de novo em instantes.' }, 502, origemResposta);
    }

    const resultado = await resposta.json();
    const texto = resultado?.choices?.[0]?.message?.content?.trim() || 'Desculpe, não consegui responder agora.';
    return json({ reply: texto }, 200, origemResposta);
  },
};
