export interface DecodedToken {
  sub?: string;
  scope?: string; // space separated e.g. "ROLE_user ROLE_admin"
  exp?: number; // seconds
  iat?: number;
  jti?: string;
}

export const tokenService = {
  decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  },

  getRoles(token: string): string[] {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.scope) return [];
    return decoded.scope
      .split(" ")
      .map((r) => r.replace(/^ROLE_/, "").toLowerCase());
  },

  getUsername(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.sub || null;
  },

  isExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  },
};
