import DOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

export function sanitizeText(text: string, maxLength: number = 1000): string {
  if (!text) return "";

  return text
    .replace(/[<>]/g, "") // Удаляем < и >
    .replace(/javascript:/gi, "") // Удаляем javascript: протокол
    .replace(/data:/gi, "") // Удаляем data: протокол
    .replace(/vbscript:/gi, "") // Удаляем vbscript: протокол
    .replace(/on\w+=/gi, "") // Удаляем event handlers
    .trim()
    .slice(0, maxLength);
}

export function sanitizeFileName(fileName: string): string {
  if (!fileName) return "";

  return fileName
    .replace(/[<>:"/\\|?*]/g, "") // Удаляем недопустимые символы для файлов
    .replace(/\.\./g, "") // Удаляем попытки path traversal
    .trim()
    .slice(0, 255);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}
