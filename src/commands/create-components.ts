import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { toPascalCase } from "../utils/string";
import { getSafeBaseDir } from "../utils/path.helper";
import { addToNearestModule } from "../utils/add-to-module";
import { validateName } from "../utils/validate-name";

export function createComponent(
  basePath: string,
  name: string,
  standalone: boolean
) {
  const componentDir = path.join(getSafeBaseDir(basePath), name);
  fs.mkdirSync(componentDir, { recursive: true });
  const componentName = toPascalCase(name);

  if (validateName(componentName) === false) {
    vscode.window.showErrorMessage(`❌ ${componentName} is invalid.`);
    return;
  }

  // get config -----------------
  const config = vscode.workspace.getConfiguration("ngFileGenerator");
  const baseComponentPath = config.get<string>("baseComponentPath");
  const baseComponentClassName = config.get<string>("baseComponentClassName");

  let imports = `
import { Component, Injector, OnInit } from '@angular/core';
import { ${baseComponentClassName} } from '${baseComponentPath}';
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
  ${standalone ? "imports: [CommonModule]," : ""}
}) 
export class ${componentName}Component extends ${baseComponentClassName} implements OnInit {
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

  vscode.window.showInformationMessage(
    `✅ Component "${componentName}" created.`
  );
}
