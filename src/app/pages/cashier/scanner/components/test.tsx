"use client";

import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import type { Result } from "@zxing/library";


export default function BarcodeScannerTest() {
  const [data, setData] = useState<string | null>(null);

  const scanBarcodeHanlder = (err: unknown, result?: Result) => {
    if (result) {
        console.log("find")
        const text = result.getText();
        setData(text);
        alert(text)
    }
  }

  return (
    <div className="w-full h-[70%]">
      <BarcodeScannerComponent
        facingMode="environment" 
        width="100%"
        height="100%"
        onUpdate={scanBarcodeHanlder}
      />
    </div>
  );
}
