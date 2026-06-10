import { TOKEN_KEYS } from "@repo/constants";

import { createAxiosAuth } from "./createAxiosAuth";

export default createAxiosAuth({
  tokenKey: TOKEN_KEYS.ADMIN,
  loginPath: "/admin/login",
});
