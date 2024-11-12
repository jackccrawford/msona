export interface AIResponse {
  text: string;
  error?: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface GrokResponse {
  choices: Array<{
    message: {
      content: string;
      refusal: null | string;
    };
  }>;
}