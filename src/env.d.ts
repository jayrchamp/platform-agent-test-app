/// <reference types="vite/client" />

declare const __BUILD_TIME__: string;

interface Window {
  __RUNTIME_CONFIG__?: {
    APP_NAME?: string;
  };
}
