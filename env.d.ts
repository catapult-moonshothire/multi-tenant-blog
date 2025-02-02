declare namespace NodeJS {
  interface ProcessEnv {
    MAIN_DOMAIN: string;
    NODE_ENV: "development" | "production";
  }
}
