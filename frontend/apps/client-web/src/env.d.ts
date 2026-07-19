interface ImportMetaEnv {
  readonly VITE_WS_URL: string;
  readonly VITE_API_URL: string;
  readonly BASE_IMAGE_URL: string;
  // Khai báo thêm các biến khác nếu có...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
