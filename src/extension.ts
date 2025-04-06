import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { createComponent } from "./commands/create-components";
import { capitalize } from "./utils/string";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "samaniGenerator.createComponent",
      async (uri: vscode.Uri) => {
        const componentName = await vscode.window.showInputBox({
          prompt: "Enter your component name:",
        });
        if (componentName) {
          const standalone = await vscode.window.showQuickPick(["yes", "no"], {
            placeHolder: "standalone?(default: no)",
          });
          const isStandalone = standalone === "yes";
          createComponent(uri.fsPath, componentName, isStandalone);
        }
      }
    ),

    vscode.commands.registerCommand(
      "samaniGenerator.createService",
      async (uri: vscode.Uri) => {
        const serviceName = await vscode.window.showInputBox({
          prompt: "نام سرویس را وارد کنید",
        });
        if (serviceName) {
          const createFolder = await vscode.window.showQuickPick(
            ["yes", "no"],
            { placeHolder: "آیا پوشه‌ای برای سرویس ایجاد شود؟" }
          );
          const inFolder = createFolder === "yes";
          createService(uri.fsPath, serviceName, inFolder);
        }
      }
    ),

    vscode.commands.registerCommand(
      "samaniGenerator.createModule",
      async (uri: vscode.Uri) => {
        const moduleName = await vscode.window.showInputBox({
          prompt: "نام ماژول را وارد کنید",
        });
        if (moduleName) {
          createModule(uri.fsPath, moduleName);
        }
      }
    )
  );
}


function createService(basePath: string, name: string, inFolder: boolean) {
  const serviceDir = inFolder ? path.join(basePath, name) : basePath;
  if (inFolder) {
    fs.mkdirSync(serviceDir);
  }

  const serviceTs = `import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ${capitalize(name)}Service {
  constructor() { }
}
`;

  fs.writeFileSync(path.join(serviceDir, `${name}.service.ts`), serviceTs);

  vscode.window.showInformationMessage(`سرویس ${name} ایجاد شد.`);
}

function createModule(basePath: string, name: string) {
  const moduleDir = path.join(basePath, name);
  fs.mkdirSync(moduleDir);

  const moduleTs = `import { NgModule } from '@angular/core';
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
export class ${capitalize(name)}Module { }
`;

  const routingTs = `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ${capitalize(name)}RoutingModule { }
`;

  fs.writeFileSync(path.join(moduleDir, `${name}.module.ts`), moduleTs);
  fs.writeFileSync(
    path.join(moduleDir, `${name}-routing.module.ts`),
    routingTs
  );

  vscode.window.showInformationMessage(
    `ماژول ${name} با فایل روتینگ ایجاد شد.`
  );
}



export function deactivate() {}
