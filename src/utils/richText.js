import katex from "katex";
import { BACKEND_ORIGIN } from "./auth";

const STORAGE_PATH_PREFIX = "/storage/";

export function normalizeStorageUrl(src) {
  if (typeof src !== "string" || src.trim() === "") {
    return src;
  }

  const value = src.trim();

  if (
    value.startsWith("data:") ||
    value.startsWith("blob:") ||
    !BACKEND_ORIGIN
  ) {
    return value;
  }

  if (value.startsWith(STORAGE_PATH_PREFIX)) {
    return `${BACKEND_ORIGIN}${value}`;
  }

  if (value.startsWith("storage/")) {
    return `${BACKEND_ORIGIN}/${value}`;
  }

  try {
    const parsed = new URL(value);

    if (parsed.pathname.startsWith(STORAGE_PATH_PREFIX)) {
      return `${BACKEND_ORIGIN}${parsed.pathname}${parsed.search}${parsed.hash}`;
    }
  } catch {
    return value;
  }

  return value;
}

export function normalizeRichImageUrls(html) {
  if (typeof html !== "string" || html.trim() === "") {
    return html || "";
  }

  try {
    const doc = new DOMParser().parseFromString(html, "text/html");

    doc.querySelectorAll("img[src]").forEach((image) => {
      image.setAttribute("src", normalizeStorageUrl(image.getAttribute("src")));
    });

    return doc.body.innerHTML;
  } catch {
    return html.replace(
      /(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi,
      (_, prefix, src, suffix) => `${prefix}${normalizeStorageUrl(src)}${suffix}`,
    );
  }
}

export function renderRichHtmlWithLatex(html) {
  const normalizedHtml = normalizeRichImageUrls(html);

  if (!normalizedHtml) {
    return "";
  }

  return normalizedHtml.replace(/\$(.*?)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula, { throwOnError: false });
    } catch {
      return formula;
    }
  });
}
