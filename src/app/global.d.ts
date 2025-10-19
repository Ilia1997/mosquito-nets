declare global {
  interface Window {
    fbq: (
      method: "track" | "consent" | string,
      eventNameOrParam?: string,
      params?: Record<string, any>
    ) => void;
  }
}
export {};
