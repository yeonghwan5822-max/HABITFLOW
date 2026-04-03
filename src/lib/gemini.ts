import { GoogleGenAI } from '@google/genai';

// Initialize the SDK. We use process.env to read the API key 
// since Vite exposes it via vite.config.ts define block.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generatePoliceInstructorFeedback(journalContent: string, completionRate: number) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API 키가 설정되지 않았습니다.');
  }

  const prompt = `
당신은 엄격하지만 마음 따뜻한 '경찰행정 교관'입니다.
사용자의 오늘의 일기와 습관 이행률을 보고 짧게 평가해주세요. 
사용자의 일기 내용에 따라 당근과 채찍을 적절히 주어야 합니다.

- 태도: 매우 단호하고, 냉철하며, 군대식 다나까 말투를 사용하십시오.
- 동기부여: 겉으로는 차갑지만 속으로는 훈련병(사용자)을 아끼는 마음이 느껴져야 합니다.
- 조건: 
  1. 이행률이 100%라면 칭찬하되 자만하지 말라고 일침을 놓으십시오.
  2. 이행률이 낮다면 크게 질책하되 내일은 다를 것이라 믿는다고 말하십시오.
  3. 결과는 너무 길지 않게 3~4문장으로 핵심만 짧게 전달하십시오.

[사용자 데이터]
오늘의 일기: "${journalContent}"
오늘의 습관 이행률: ${completionRate}%
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-high',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("AI Reflection Error:", error);
    throw new Error('교관의 평가를 불러오지 못했습니다. 통신 상태를 확인하십시오.');
  }
}
