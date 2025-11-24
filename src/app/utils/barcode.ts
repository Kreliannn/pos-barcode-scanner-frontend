"use client";
import JsBarcode from "jsbarcode";

export async function generateBarcodePng(
  barcode: string,
  opts?: {
    width?: number;
    height?: number;
    fontSize?: number;
    format?: string;
    displayValue?: boolean;
    lineColor?: string;
    background?: string;
    margin?: number;
  }
): Promise<string> {
  const {
    width = 300,
    height = 80,
    fontSize = 14,
    format = "CODE128",
    displayValue = true,
    lineColor = "#000000",
    background = "#ffffff",
    margin = 10,
  } = opts || {};

  // create offscreen SVG
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGSVGElement;
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));

  // generate barcode
  JsBarcode(svg, barcode, {
    format,
    displayValue,
    fontSize,
    width: 2, // thick enough for scanner
    height: height - (displayValue ? 20 : 0),
    lineColor,
    background,
    margin,
  });

  // serialize SVG
  const svgString = new XMLSerializer().serializeToString(svg);
  const svgBase64 = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));

  // convert to PNG
  return await new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Cannot get canvas context"));
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl);
    };
    img.onerror = (e) => reject(e);
    img.src = svgBase64;
  });
}


/**
 * Print a single barcode.
 * Opens a new window with the barcode image then calls print().
 */
export async function printOne(barcode: string, options?: { title?: string; imgWidth?: number }) {
  try {
    const png = await generateBarcodePng(barcode);
    const title = options?.title ?? barcode;
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
            .card {
              text-align:center;
            }
            img { width: ${imgWidth}px; display:block; margin: 0 auto; }
            .label { margin-top: 8px; font-family: sans-serif; font-size: 12pt; }
            @media print {
              @page { margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <img src="${png}" alt="${barcode}" />
          </div>
        </body>
      </html>
    `;

    win.document.write(html);
    win.document.close();

    // Ensure resources loaded before print -> small timeout to allow rendering
    win.focus();
    setTimeout(() => {
      win.print();
      // optionally close after print (some browsers block)
      // setTimeout(() => win.close(), 500);
    }, 300);
  } catch (err) {
    console.error("printOne error:", err);
    throw err;
  }
}

/**
 * Print many copies in a grid ready to cut.
 * copies: how many copies total (e.g. 12)
 * cols: how many columns per page (e.g. 3)
 */
export async function printMany(barcode: string, copies = 12, options?: { cols?: number; title?: string; imgWidth?: number; gapMm?: number; border?: boolean; }) {
  try {
    const png = await generateBarcodePng(barcode);
    const cols = options?.cols ?? 3;
    const title = options?.title ?? barcode;
    const imgWidth = options?.imgWidth ?? 180;
    const gap = options?.gapMm ?? 6;
    const border = options?.border ?? true;

    const win = window.open("", "_blank");
    if (!win) throw new Error("Failed to open print window");

    // create grid items
    const items = Array(copies).fill(0).map(() => `
      <div class="cell">
        <img src="${png}" alt="${barcode}" />
      </div>
    `).join("");

    const html = `
      <html>
        <head>
          <title>${title} - labels</title>
          <style>
            html,body { margin:0; padding:0; }
            body {
              padding: 10mm;
              -webkit-print-color-adjust: exact;
              box-sizing: border-box;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(${cols}, 1fr);
              gap: ${gap}mm;
              align-items: center;
              justify-items: center;
            }
            .cell {
              width: ${imgWidth}px;
              text-align: center;
              padding: 6px;
              box-sizing: border-box;
              ${border ? "border: 1px dashed #999;" : ""}
            }
            img { width: 100%; height: auto; display:block; margin: 0 auto 6px; }
            .label { font-family: sans-serif; font-size: 10pt; }
            @media print {
              @page { margin: 8mm; }
              .cell { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="grid">
            ${items}
          </div>
        </body>
      </html>
    `;

    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      // optional close after print
      // setTimeout(() => win.close(), 500);
    }, 500);
  } catch (err) {
    console.error("printMany error:", err);
    throw err;
  }
}
