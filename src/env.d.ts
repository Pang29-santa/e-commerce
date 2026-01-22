declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    NG_APP_GROQ_API_KEY: string;
    NG_APP_GEMINI_API_KEY: string;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};
