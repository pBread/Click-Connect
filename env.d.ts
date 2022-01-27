declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCOUNT_SID: string;
      AUTH_TOKEN: string;
      SYNC_SVC_SID: string;
    }
  }
}

export {};
