import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { capitalize, toPascalCase } from "../utils/string";
import { getSafeBaseDir } from "../utils/path.helper";

export function createComponent(
  basePath: string,
  name: string,
  standalone: boolean
) {
  const componentDir = path.join(getSafeBaseDir(basePath), name);
  fs.mkdirSync(componentDir);
  const componentName = toPascalCase(name);

  let imports = `
import { Component, Injector, OnInit } from '@angular/core';
import { AppBaseComponent } from '@app/app-base.component';
`;
  if (standalone) {
    imports = `import { CommonModule } from '@angular/common'` + imports;
  }

  const componentTs = `
${imports}
@Component({
  selector: 'app-${name}',
  templateUrl: './${name}.component.html',
  styleUrls: ['./${name}.component.scss'],
  standalone: ${standalone},
}) 
export class ${componentName}Component extends AppBaseComponent implements OnInit {
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}
}
`;

  if (standalone === false) {
    addToNearestModule(
      componentName,
      componentName + "Component",
      componentDir + "/" + name + ".component"
    );
  }
  // --------------------------------------------------------------------------------------------------------

  const componentHtml = `<p>${name} works!</p>`;
  const componentScss = `/* custom styles ${name} */`;

  fs.writeFileSync(
    path.join(componentDir, `${name}.component.ts`),
    componentTs
  );
  fs.writeFileSync(
    path.join(componentDir, `${name}.component.html`),
    componentHtml
  );
  fs.writeFileSync(
    path.join(componentDir, `${name}.component.scss`),
    componentScss
  );

  vscode.window.showInformationMessage(`Component ${componentName} Created.`);
}

/**
 * add component to nearest module
 * - if standalone is false
 * @param componentName
 * @param componentClassName
 * @param componentPath
 * @returns
 */
function addToNearestModule(
  componentName: string,
  componentClassName: string,
  componentPath: string
) {
  let dir = path.dirname(componentPath);

  while (dir !== path.parse(dir).root) {
    const files = fs.readdirSync(dir);
    const moduleFile = files.find((f) => f.endsWith(".module.ts"));
    if (moduleFile) {
      const modulePath = path.join(dir, moduleFile);
      let content = fs.readFileSync(modulePath, "utf8");

      // اگه import نشده باشه، اضافه کن
      const relativeImport = path
        .relative(dir, componentPath)
        .replace(/\\/g, "/")
        .replace(/\.ts$/, "");
      const importLine = `import { ${componentClassName} } from './${relativeImport}';`;

      if (!content.includes(importLine)) {
        content = importLine + "\n" + content;
      }

      // اگر declarations وجود نداره، اضافه‌اش کن
      if (!/declarations\s*:\s*\[/.test(content)) {
        content = content.replace(
          /@NgModule\s*\(\s*{/,
          (match) => `${match}\n  declarations: [${componentClassName}],`
        );
      } else {
        // اگر داخل declarations نیست، اضافه‌اش کن
        content = content.replace(
          /declarations\s*:\s*\[([^\]]*)\]/,
          (match, declarations) => {
            const parts = declarations
              .split(",")
              .map((d: string) => d.trim())
              .filter(Boolean);
            if (!parts.includes(componentClassName)) {
              parts.push(componentClassName);
            }
            return `declarations: [${parts.join(", ")}]`;
          }
        );
      }

      fs.writeFileSync(modulePath, content, "utf8");
      console.log(
        `✅ "${componentClassName}" added to module "${moduleFile}".`
      );
      return;
    }

    dir = path.dirname(dir); // حرکت به بالا
  }

  console.warn("⚠️ module.ts not found!");
}
