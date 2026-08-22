/**
 * REDROOM AI Model Registry & Multi-Provider Configuration
 */

export interface ModelEndpointConfig {
  id: string;
  name: string;
  provider: "huggingface" | "openrouter" | "pollinations" | "groq" | "gemini" | "openai_compatible" | "mock_fallback";
  modelName: string;
  endpointUrl: string;
  authHeaderPrefix: string;
  envKeyName?: string;
  extraHeaders?: Record<string, string>;
}

export const AI_MODELS_PRIORITY_LIST: ModelEndpointConfig[] = [
  // 1. Primary: Qwen 2.5 72B via Hugging Face Serverless Router
  {
    id: "hf-qwen-2.5-72b",
    name: "Qwen 2.5 72B Instruct (Hugging Face)",
    provider: "huggingface",
    modelName: "Qwen/Qwen2.5-72B-Instruct",
    endpointUrl: "https://router.huggingface.co/v1/chat/completions",
    authHeaderPrefix: "Bearer",
    envKeyName: "HF_TOKEN",
  },
  // 2. Secondary: Llama 3.3 70B Instruct via Hugging Face
  {
    id: "hf-llama-3.3-70b",
    name: "Llama 3.3 70B Instruct (Hugging Face)",
    provider: "huggingface",
    modelName: "meta-llama/Llama-3.3-70B-Instruct",
    endpointUrl: "https://router.huggingface.co/v1/chat/completions",
    authHeaderPrefix: "Bearer",
    envKeyName: "HF_TOKEN",
  },
  // 3. Tertiary: OpenRouter Free Models
  {
    id: "or-gemini-flash-free",
    name: "Gemini 2.0 Flash (OpenRouter Free)",
    provider: "openrouter",
    modelName: "google/gemini-2.0-flash-exp:free",
    endpointUrl: "https://openrouter.ai/api/v1/chat/completions",
    authHeaderPrefix: "Bearer",
    envKeyName: "OPENROUTER_API_KEY",
    extraHeaders: {
      "HTTP-Referer": "https://redroom.upsc",
      "X-Title": "REDROOM UPSC OS",
    },
  },
  {
    id: "or-llama-3.3-free",
    name: "Llama 3.3 70B (OpenRouter Free)",
    provider: "openrouter",
    modelName: "meta-llama/llama-3.3-70b-instruct:free",
    endpointUrl: "https://openrouter.ai/api/v1/chat/completions",
    authHeaderPrefix: "Bearer",
    envKeyName: "OPENROUTER_API_KEY",
    extraHeaders: {
      "HTTP-Referer": "https://redroom.upsc",
      "X-Title": "REDROOM UPSC OS",
    },
  },
  // 4. Mistral Small 24B via Hugging Face
  {
    id: "hf-mistral-small",
    name: "Mistral Small 24B (Hugging Face)",
    provider: "huggingface",
    modelName: "mistralai/Mistral-Small-24B-Instruct-2501",
    endpointUrl: "https://router.huggingface.co/v1/chat/completions",
    authHeaderPrefix: "Bearer",
    envKeyName: "HF_TOKEN",
  },
  // 5. DeepSeek R1 Distill Qwen 32B via Hugging Face
  {
    id: "hf-deepseek-r1-qwen",
    name: "DeepSeek R1 Distill 32B (Hugging Face)",
    provider: "huggingface",
    modelName: "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    endpointUrl: "https://router.huggingface.co/v1/chat/completions",
    authHeaderPrefix: "Bearer",
    envKeyName: "HF_TOKEN",
  },
  // 6. Groq Fast Inference (if GROQ_API_KEY configured)
  {
    id: "groq-llama-3.3-70b",
    name: "Llama 3.3 70B Versatile (Groq)",
    provider: "groq",
    modelName: "llama-3.3-70b-versatile",
    endpointUrl: "https://api.groq.com/openai/v1/chat/completions",
    authHeaderPrefix: "Bearer",
    envKeyName: "GROQ_API_KEY",
  },
  // 7. Pollinations AI Zero-Auth Free AI Gateway
  {
    id: "pollinations-free-ai",
    name: "Pollinations Fast Zero-Auth Gateway",
    provider: "pollinations",
    modelName: "openai",
    endpointUrl: "https://text.pollinations.ai/",
    authHeaderPrefix: "",
  },
];

