import * as vscode from "vscode";
export class SamaniSettingsViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    console.log("✅ resolveWebviewView called");
    const config = vscode.workspace.getConfiguration("ngFileGenerator");
    const baseComponentName = config.get("baseComponentClassName", "");
    const baseComponentPath = config.get("baseComponentPath", "");

    webviewView.webview.options = {
      enableScripts: true,
    };
    webviewView.webview.html = this.getHtml(webviewView.webview);
    setTimeout(() => {
      webviewView.webview.postMessage({
        type: "init",
        values: {
          baseComponentName,
          baseComponentPath,
        },
      });
    }, 100); // یه مقدار تأخیر برای اطمینان از لود HTML

    
    webviewView.webview.onDidReceiveMessage((message) => {
      const config = vscode.workspace.getConfiguration("ngFileGenerator");

      if (message.type === "updateSettingBaseComponentName") {
        config.update("baseComponentClassName", message.value, true);
      }
      if (message.type === "updateSettingBaseComponentPath") {
        config.update("baseComponentPath", message.value, true);
      }
    });
  }

  private getHtml(webview: vscode.Webview): string {
    return `
        <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: sans-serif;
          padding: 20px;
          direction: ltr;
        }
        h4 {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin: 10px 0 5px;
          font-weight: bold;
        }
        input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .form-group {
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <h4> Base Component Setting</h4>

      <div class="form-group">
        <label for="baseComponentName">Class name of BaseComponent:</label>
        <input type="text" id="baseComponentName" />
      </div>

      <div class="form-group">
        <label for="baseComponentPath">Base component path:</label>
        <input type="text" id="baseComponentPath" />
      </div>

      <script>
        const vscode = acquireVsCodeApi();

        window.addEventListener('message', event => {
          const message = event.data;
          if (message.type === 'init') {
            document.getElementById('baseComponentName').value = message.values.baseComponentName || '';
            document.getElementById('baseComponentPath').value = message.values.baseComponentPath || '';
          }
        });

        document.getElementById('baseComponentName').addEventListener('input', (e) => {
          vscode.postMessage({
            type: 'updateSettingBaseComponentName',
            value: e.target.value
          });
        });

        document.getElementById('baseComponentPath').addEventListener('input', (e) => {
          vscode.postMessage({
            type: 'updateSettingBaseComponentPath',
            value: e.target.value
          });
        });
      </script>
    </body>
    </html>
      `;
  }
}
