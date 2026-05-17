import fs from "fs";

let c = fs.readFileSync("packages/types/src/index.ts", "utf8");
c = c.replace("export * from \"./chat\";\r\n", "");
c = c.replace("export * from \"./chat\";\n", "");
fs.writeFileSync("packages/types/src/index.ts", c);

let apiC = fs.readFileSync("packages/api/src/chatApi.ts", "utf8");
apiC = apiC.replace(/@repo\/schemas/g, "."); // Wait, actually the chatApi might be importing types that don't exist
fs.writeFileSync("packages/api/src/chatApi.ts", apiC);
