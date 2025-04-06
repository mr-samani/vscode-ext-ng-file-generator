import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { capitalize, toPascalCase } from "../utils/string";
import { getSafeBaseDir } from "../utils/path.helper";
import { addToNearestModule } from "../utils/add-to-module";
import { validateName } from "../utils/validate-name";

/**
 * generate angular service
 * @param basePath base path is right click on folder or files
 * @param name service name
 * @param inFolder create folder for service?
 * @param inRootInjectable add service to module provicers or injectable in root?
 */
export function createService(
  basePath: string,
  name: string,
  inFolder: boolean,
  inRootInjectable: boolean
) {
  const serviceDir = inFolder
    ? path.join(getSafeBaseDir(basePath), name)
    : getSafeBaseDir(basePath);
  const serviceName = toPascalCase(name);
  if (validateName(serviceName) === false) {
    vscode.window.showErrorMessage(`❌ ${serviceName} is invalid.`);
    return;
  }

  if (inFolder) {
    fs.mkdirSync(serviceDir);
  }

  const serviceTs = `import { Injectable } from '@angular/core';
${
  inRootInjectable
    ? `@Injectable({
  providedIn: 'root',
})`
    : `@Injectable()`
}

export class ${serviceName}Service {
  constructor() { }
}
`;

  fs.writeFileSync(path.join(serviceDir, `${name}.service.ts`), serviceTs);
  vscode.window.showInformationMessage(`✅ Service "${serviceName}" created.`);
  if (inRootInjectable === false) {
    addToNearestModule(
      serviceName,
      `${serviceName}Service`,
      `${serviceDir}/${name}.service`,
      false
    );
  }
}
