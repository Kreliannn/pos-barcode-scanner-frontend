"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeProps {
  value: string;
}

export default function Barcode({ value }: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    JsBarcode(svgRef.current, value, {
      format: "CODE128",
      displayValue: true,
      fontSize: 16,

      // IMPORTANT FIXES FOR ZXING
      width: 2,             // thicker bars
      height: 80,
      margin: 10,           // quiet zone around barcode
      lineColor: "#000000", // black bars
      background: "#FFFFFF" // white background
    });
  }, [value]);

  return <svg ref={svgRef}></svg>;
}
