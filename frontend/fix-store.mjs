import fs from "fs";

function fixStore(file) {
  let c = fs.readFileSync(file, "utf8");
  c = c.replace(
    "import type { UpdateProfilePayload } from \"@repo/api\";",
    "import type { UpdateProfileSchema } from \"../features/auth/schemas\";"
  );
  c = c.replace(
    "updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;",
    "updateProfile: (payload: UpdateProfileSchema) => Promise<boolean>;"
  );
  fs.writeFileSync(file, c);
}

fixStore("apps/admin/src/stores/useAuthStore.ts");
fixStore("apps/client-web/src/stores/useAuthStore.ts");
