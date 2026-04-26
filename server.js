const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const host = '0.0.0.0';
const allowedOrigin = process.env.CORS_ORIGIN || 'http://esgfit.kro.kr';

// Middleware
app.use(helmet());
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '.'))); // Serve static files using absolute path

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create context for ESG chatbot
    const context = `당신은 ESGFit이라는 ESG 진단 플랫폼의 챗봇입니다.
ESG는 환경(Environmental), 사회(Social), 지배구조(Governance)를 의미하며, 기업의 비재무적 성과를 평가합니다.
저희 플랫폼은 P·E·S·G 4개 영역으로 진단합니다:
- P(정보공시): ESG 정보의 공시 형식, 내용, 검증
- E(환경): 온실가스, 에너지, 용수, 폐기물, 오염물질 등
- S(사회): 노동, 다양성, 안전보건, 지역사회 기여 등
- G(지배구조): 이사회, 주주권리, 윤리경영 등

사용자의 질문에 친절하고 전문적으로 답변하세요. ESG 관련 개념 설명, 진단 방법, 점수 기준 등을 알려주세요.`;

    const prompt = `${context}\n\n사용자: ${message}\n챗봇:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

if (require.main === module) {
  app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
  });
}

module.exports = app;