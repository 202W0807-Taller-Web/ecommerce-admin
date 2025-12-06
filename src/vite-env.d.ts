/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string; // La que ya estaba
    readonly VITE_API_LOCAL: string; // La de inventario
    // --- TUS NUEVAS VARIABLES ---
    readonly VITE_API_ORDERS_QUERY: string;
    readonly VITE_API_ORDERS_COMMAND: string;
    readonly VITE_API_RETURNS: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
