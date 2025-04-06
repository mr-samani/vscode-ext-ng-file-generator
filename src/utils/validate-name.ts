/**
 * اعتبارسنجی اسم کامپوننت یا سرویس به صورت PascalCase
 * @param name نام کامپوننت یا سرویس
 * @returns true اگر نام معتبر است، false در غیر این صورت
 */
export function validateName(name: string): boolean {
  // اسم باید فقط حروف و اعداد داشته باشه و با حرف بزرگ شروع بشه
  const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
  return pascalCaseRegex.test(name);
}
