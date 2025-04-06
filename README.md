# ng-file-generator

**ng-file-generator** is a Visual Studio Code extension that helps Angular developers to quickly generate modules, components, services, pipes, and more by extending base components. It automates the creation of essential Angular files, making development faster and more efficient.

## Features

- **Generate Components**: Easily create Angular components with your predefined template.
- **Generate Services**: Generate Angular services with essential structure.
- **Generate Modules**: Automatically generate Angular modules, including routing support.
- **Extends Base Components**: Customizes generated files with base components for consistency.

## Installation

1. Clone the repository or download the extension.
2. Open VS Code and go to the **Extensions** view (`Ctrl+Shift+X`).
3. Search for `ng-file-generator` or use the `Install from VSIX` option if the extension is not published yet.

## Usage

Once installed, right-click in your **Explorer** view or use the command palette (`Ctrl+Shift+P`), and you will see the following options under the **Samani file generator** submenu:

- **> Generate component**: Creates an Angular component with your specified template.
- **> Generate Service**: Generates an Angular service with base structure.
- **> Generate Module**: Automatically generates an Angular module with routing included.

### Commands

- `samaniGenerator.createComponent`: Generate a component.
- `samaniGenerator.createService`: Generate a service.
- `samaniGenerator.createModule`: Generate a module.

### Menu Structure

You can access these generation options by right-clicking in the **Explorer** view, where you will see the submenu:

- **Samani file generator**:
  - **> Generate component**
  - **> Generate Service**
  - **> Generate Module**

## Development

### Prerequisites

- Node.js (v14 or higher)
- Yarn (recommended for package management)
- VS Code (v1.50.0 or higher)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/mr-samani/vscode-ext-ng-file-generator.git
   cd ng-file-generator
