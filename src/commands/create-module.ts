import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { toPascalCase } from "../utils/string";
import { getSafeBaseDir } from "../utils/path.helper";
import { validateName } from "../utils/validate-name";

export function createModule(
  basePath: string,
  name: string,
  routingFile: boolean
) {
  const moduleDir = path.join(getSafeBaseDir(basePath), name);
  fs.mkdirSync(moduleDir, { recursive: true });

  const moduleName = toPascalCase(name);
  if (validateName(moduleName) === false) {
    vscode.window.showErrorMessage(`❌ ${moduleName} is invalid.`);
    return;
  }

  let moduleTs = "";
  if (routingFile === false) {
    moduleTs = `import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { RouterModule, Routes } from '@angular/router';
    
    const routes: Routes = [];
    
    @NgModule({
      declarations: [],
      imports: [
        CommonModule,
        RouterModule.forChild(routes)
      ]
    })
    export class ${moduleName}Module { }
    `;
  } else {
    moduleTs = `import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { ${moduleName}RoutingModule } from './${name}-routing.module';
    
    @NgModule({
      declarations: [],
      imports: [
        CommonModule,
         ${moduleName}RoutingModule
      ]
    })
    export class ${moduleName}Module { }
    `;
    const routingTs = `import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    
    const routes: Routes = [];
    
    @NgModule({
      imports: [RouterModule.forChild(routes)],
      exports: [RouterModule]
    })
    export class ${moduleName}RoutingModule { }
    `;
    fs.writeFileSync(
      path.join(moduleDir, `${name}-routing.module.ts`),
      routingTs
    );
  }

  fs.writeFileSync(path.join(moduleDir, `${name}.module.ts`), moduleTs);

  vscode.window.showInformationMessage(`✅ Module "${moduleName}" created.`);
}
