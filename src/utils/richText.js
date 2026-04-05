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

  // Regex to match:
  // 1. $$ ... $$ (display)
  // 2. \[ ... \] (display)
  // 3. \( ... \) (inline)
  // 4. $ ... $ (inline)
  // 5. <span class="math-tex"> ... </span>
  const regex = /(?:\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|\$([^$]+?)\$|<span class="math-tex">([\s\S]*?)<\/span>)/g;

  return normalizedHtml.replace(regex, (match, d1, d2, i1, i2, s1) => {
    let formula = "";
    let isDisplay = false;

    if (d1 !== undefined) { formula = d1; isDisplay = true; }
    else if (d2 !== undefined) { formula = d2; isDisplay = true; }
    else if (i1 !== undefined) { formula = i1; isDisplay = false; }
    else if (i2 !== undefined) { formula = i2; isDisplay = false; }
    else if (s1 !== undefined) { formula = s1; isDisplay = false; }

    try {
      const decodedFormula = formula
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ");

      return katex.renderToString(decodedFormula.trim(), {
        throwOnError: false,
        displayMode: isDisplay,
      });
    } catch {
      return match;
    }
  });
}
