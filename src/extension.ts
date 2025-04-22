import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { createComponent } from "./commands/create-components";
import { capitalize } from "./utils/string";
import { createService } from "./commands/create-service";
import { createModule } from "./commands/create-module";
import { SamaniSettingsViewProvider } from "./views/setting-view.provider";

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
          prompt: "Enter your service name:",
        });
        if (serviceName) {
          const createFolder = await vscode.window.showQuickPick(
            ["yes", "no"],
            { placeHolder: "Should a folder be created for the service?" }
          );
          const inFolder = createFolder === "yes";

          const injectableInModule = await vscode.window.showQuickPick(
            ["yes", "no"],
            { placeHolder: "Injectable provide in root?" }
          );
          const inRootInjectable = injectableInModule === "yes";
          createService(uri.fsPath, serviceName, inFolder, inRootInjectable);
        }
      }
    ),

    vscode.commands.registerCommand(
      "samaniGenerator.createModule",
      async (uri: vscode.Uri) => {
        const moduleName = await vscode.window.showInputBox({
          prompt: "Enter your module name:",
        });
        if (moduleName) {
          const createRouting = await vscode.window.showQuickPick(
            ["yes", "no"],
            { placeHolder: "Should a routing file be created?" }
          );
          const routingFile = createRouting === "yes";
          createModule(uri.fsPath, moduleName, routingFile);
        }
      }
    ),

    vscode.window.registerWebviewViewProvider(
      "samaniSettingsView",
      new SamaniSettingsViewProvider(context)
    )
  );
}

export function deactivate() {}
