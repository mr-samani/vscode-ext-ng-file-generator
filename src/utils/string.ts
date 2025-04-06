export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toPascalCase(input: string): string {
  return input
    .replace(/[-_]+/g, " ") // تبدیل - و _ به فاصله
    .replace(
      /\s+(.)(\w*)/g,
      (_, first, rest) => first.toUpperCase() + rest.toLowerCase()
    ) // حروف بعدی بزرگ شه
    .replace(/^(.)/, (_, first) => first.toUpperCase()); // حرف اول بزرگ شه
}
