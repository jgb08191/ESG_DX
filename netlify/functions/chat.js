const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  // POST 요청 확인
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed. POST only.' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  // CORS preflight 처리
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  try {
    // 요청 바디 파싱
    const body = JSON.parse(event.body || '{}');
    const { message } = body;

    // 메시지 검증
    if (!message || message.trim() === '') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    // API 키 확인
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_API_KEY is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API configuration error' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    // Gemini AI 초기화
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }, { apiVersion: 'v1' });

    // ESG 챗봇 시스템 프롬프트
    const systemPrompt = `당신은 ESGFit이라는 ESG 진단 플랫폼의 챗봇입니다. P·E·S·G 영역을 전문적으로 설명하고 친절하게 답변하세요.

ESG는 다음 4개 영역으로 구성됩니다:
- P(정보공시): ESG 정보의 공시 형식, 내용, 검증
- E(환경): 온실가스, 에너지, 용수, 폐기물, 오염물질 등
- S(사회): 노동, 다양성, 안전보건, 지역사회 기여 등
- G(지배구조): 이사회, 주주권리, 윤리경영 등

사용자의 질문에 전문적이고 친절하게 답변하세요.`;

    // 프롬프트 구성
    const prompt = `${systemPrompt}\n\n사용자: ${message}\n챗봇:`;

    // Gemini API 호출
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ response: text }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Error:', error);

    // 요청 바디 파싱 실패
    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      };
    }

    // Gemini API 호출 실패 등 기타 에러
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
};
