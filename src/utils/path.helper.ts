import * as fs from 'fs';
import * as path from 'path';

export function getSafeBaseDir(basePath: string): string {
  // اگه فایل بود، مسیر پوشه‌ش رو برگردون
  if (fs.existsSync(basePath) && fs.statSync(basePath).isFile()) {
    return path.dirname(basePath);
  }
  return basePath;
}
