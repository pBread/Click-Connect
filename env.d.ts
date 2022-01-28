declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCOUNT_SID: string;
      AUTH_TOKEN: string;
      NEXT_PUBLIC_PHONE: string;
      SF_PASSWORD: string;
      SF_TOKEN: string;
      SF_USERNAME: string;
      SYNC_SVC_SID: string;
    }
  }
}

export {};
