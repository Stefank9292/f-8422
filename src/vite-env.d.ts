/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APIFY_TOKEN: string;
  readonly VITE_APIFY_ACTOR_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}