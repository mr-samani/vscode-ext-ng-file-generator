import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

/**
 * Adds a component or service to the nearest module's declarations or providers.
 * Only works if standalone is false.
 * @param name kebab-case name like "my-component"
 * @param className PascalCase class name like "MyComponent"
 * @param absolutePath Absolute path to the component/service .ts file
 * @param isComponent true for component, false for service
 */
export function addToNearestModule(
  name: string,
  className: string,
  absolutePath: string,
  isComponent: boolean = true
) {
  let dir = path.dirname(absolutePath);
  const keyAttribute = isComponent ? "declarations" : "providers";

  while (dir !== path.parse(dir).root) {
    const files = fs.readdirSync(dir);
    const moduleFile = files.find((f) => f.endsWith(".module.ts"));
    if (moduleFile) {
      const modulePath = path.join(dir, moduleFile);
      let content = fs.readFileSync(modulePath, "utf8");

      // اضافه کردن import اگر وجود نداشت
      const relativeImport = path
        .relative(dir, absolutePath)
        .replace(/\\/g, "/")
        .replace(/\.ts$/, "");
      const importLine = `import { ${className} } from './${relativeImport}';`;

      if (!content.includes(importLine)) {
        content = importLine + "\n" + content;
      }

      const keyRegex = new RegExp(`${keyAttribute}\\s*:\\s*\\[([\\s\\S]*?)\\]`);
      if (!keyRegex.test(content)) {
        // اگر declarations یا providers وجود نداشت، اضافه کن
        content = content.replace(
          /@NgModule\s*\(\s*{/,
          (match) => `${match}\n  ${keyAttribute}: [${className}],`
        );
      } else {
        // اگر وجود داشت ولی اسم کلاس نبود، اضافه‌اش کن
        content = content.replace(keyRegex, (match, entries) => {
          const parts = entries
            .split(",")
            .map((d: string) => d.trim())
            .filter(Boolean);
          if (!parts.includes(className)) {
            parts.push(className);
          }
          return `${keyAttribute}: [${parts.join(", ")}]`;
        });
      }

      fs.writeFileSync(modulePath, content, "utf8");
      console.log(
        `✅ "${className}" به "${keyAttribute}" ماژول ${moduleFile} اضافه شد.`
      );
      return;
    }

    dir = path.dirname(dir); // حرکت به مسیر والد
  }

  console.warn("⚠️ هیچ فایل module.ts در مسیرهای بالا پیدا نشد!");
}
