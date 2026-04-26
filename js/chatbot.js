// AI-powered chatbot using Gemini API
function chatbotHTML() {
  return `
  <button class="chatbot-btn" id="chatbotBtn" aria-label="챗봇 열기">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </button>
  <div class="chatbot-panel" id="chatbotPanel" role="dialog" aria-label="ESG 도우미">
    <div class="chatbot-header">
      <div>
        <div class="chatbot-title">ESG 도우미</div>
        <div class="chatbot-subtitle">● 온라인 · 무엇이든 물어보세요</div>
      </div>
      <button class="chatbot-close" id="chatbotClose" aria-label="닫기">✕</button>
    </div>
    <div class="chatbot-body" id="chatbotBody"></div>
    <div class="chatbot-suggestions" id="chatbotSuggestions">
      <button class="chip" data-q="ESG가 뭐야?">ESG가 뭐야?</button>
      <button class="chip" data-q="진단은 어떻게 시작해?">진단 시작</button>
      <button class="chip" data-q="점수 기준 알려줘">점수 기준</button>
      <button class="chip" data-q="최근 정부 정책">최근 정책</button>
    </div>
    <form class="chatbot-input" id="chatbotForm">
      <input type="text" id="chatbotInput" placeholder="질문을 입력해 주세요" autocomplete="off">
      <button type="submit" class="chatbot-send" aria-label="전송">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  </div>`;
}

function appendMsg(body, text, who) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${who}`;
  msg.innerHTML = who === 'bot'
    ? `<div class="chat-avatar">AI</div><div class="chat-bubble">${text}</div>`
    : `<div class="chat-bubble">${text}</div>`;
  body.appendChild(msg);
  body.scrollTop = body.scrollHeight;
}

async function sendToAI(message) {
  const endpoint = '/api/chat';
  let lastError = null;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    if (response.ok) {
      return data.response;
    }

    lastError = data?.error || '서버 요청 중 오류가 발생했습니다.';
  } catch (error) {
    lastError = error.message || String(error);
  }

  if (lastError) {
    console.error('Chatbot request failed:', lastError);
  }

  return '네트워크 오류가 발생했습니다. 인터넷 연결 또는 서버 구성을 확인해주세요.';
}

function initChatbot() {
  const root = document.getElementById('chatbotRoot');
  if (!root) return;
  root.innerHTML = chatbotHTML();

  const btn = document.getElementById('chatbotBtn');
  const panel = document.getElementById('chatbotPanel');
  const closeBtn = document.getElementById('chatbotClose');
  const body = document.getElementById('chatbotBody');
  const form = document.getElementById('chatbotForm');
  const input = document.getElementById('chatbotInput');
  const chips = document.getElementById('chatbotSuggestions');

  let opened = false;

  const openPanel = () => {
    panel.classList.add('open');
    if (!opened) {
      appendMsg(body, '안녕하세요! ESG 진단 도우미입니다. 궁금하신 내용을 편하게 물어봐 주세요. 🌱', 'bot');
      opened = true;
    }
    setTimeout(() => input.focus(), 100);
  };

  btn.addEventListener('click', () => {
    panel.classList.contains('open') ? panel.classList.remove('open') : openPanel();
  });
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  const sendText = async (text) => {
    if (!text.trim()) return;
    appendMsg(body, text, 'user');
    input.value = '';

    // Show typing indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'chat-msg bot typing';
    typingMsg.innerHTML = '<div class="chat-avatar">AI</div><div class="chat-bubble">답변을 생성하고 있습니다...</div>';
    body.appendChild(typingMsg);
    body.scrollTop = body.scrollHeight;

    const reply = await sendToAI(text);

    // Remove typing indicator
    body.removeChild(typingMsg);

    appendMsg(body, reply, 'bot');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendText(input.value);
  });
  chips.addEventListener('click', (e) => {
    const q = e.target.closest('.chip')?.dataset.q;
    if (q) sendText(q);
  });
}

document.addEventListener('DOMContentLoaded', initChatbot);
