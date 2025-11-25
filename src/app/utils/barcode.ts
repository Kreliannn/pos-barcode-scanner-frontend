"use client";
import QRCode from "qrcode";

/**
 * Generate a QR code as a PNG data URL
 */
export async function generateQrCodePng(
  text: string,
  opts?: {
    width?: number;
    margin?: number;
    colorDark?: string;
    colorLight?: string;
  }
): Promise<string> {
  const { width = 300, margin = 2, colorDark = "#000000", colorLight = "#ffffff" } = opts || {};

  return await QRCode.toDataURL(text, {
    width,
    margin,
    color: {
      dark: colorDark,
      light: colorLight,
    },
  });
}

/**
 * Print a single QR code
 */
export async function printOneQr(text: string, options?: { title?: string; imgWidth?: number }) {
  try {
    const png = await generateQrCodePng(text);
    const title = options?.title ?? text;
    const imgWidth = options?.imgWidth ?? 300;

    const win = window.open("", "_blank");
    if (!win) throw new Error("Failed to open print window");

    const html = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            html,body { margin:0; padding:0; }
            body {
              display:flex;
              align-items:center;
              justify-content:center;
              height:100vh;
              -webkit-print-color-adjust: exact;
            }
            img { width: ${imgWidth}px; display:block; margin: 0 auto; }
          </style>
        </head>
        <body>
          <img src="${png}" alt="${text}" />
        </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  } catch (err) {
    console.error("printOneQr error:", err);
    throw err;
  }
}

/**
 * Print multiple copies of QR code in a grid
 */
export async function printManyQr(
  text: string,
  copies = 12,
  options?: { cols?: number; imgWidth?: number; gapMm?: number; border?: boolean }
) {
  try {
    const png = await generateQrCodePng(text);
    const cols = options?.cols ?? 3;
    const imgWidth = options?.imgWidth ?? 180;
    const gap = options?.gapMm ?? 6;
    const border = options?.border ?? true;

    const win = window.open("", "_blank");
    if (!win) throw new Error("Failed to open print window");

    const items = Array(copies)
      .fill(0)
      .map(() => `<div class="cell"><img src="${png}" alt="${text}" /></div>`)
      .join("");

    const html = `
      <html>
        <head>
          <title>${text} - QR labels</title>
          <style>
            html,body { margin:0; padding:0; }
            body { padding: 10mm; -webkit-print-color-adjust: exact; box-sizing: border-box; }
            .grid { display:grid; grid-template-columns: repeat(${cols}, 1fr); gap: ${gap}mm; align-items:center; justify-items:center; }
            .cell { width: ${imgWidth}px; text-align:center; padding: 6px; box-sizing:border-box; ${border ? "border: 1px dashed #999;" : ""} }
            img { width: 100%; height:auto; display:block; margin:0 auto 6px; }
            @media print { @page { margin: 8mm; } .cell { page-break-inside: avoid; } }
          </style>
        </head>
        <body>
          <div class="grid">${items}</div>
        </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  } catch (err) {
    console.error("printManyQr error:", err);
    throw err;
  }
}
