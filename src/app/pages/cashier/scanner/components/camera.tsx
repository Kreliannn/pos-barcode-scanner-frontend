"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import type { Result } from "@zxing/library";

export default function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [scanned, setScanned] = useState<string>("");

  useEffect(() => {
    if (!videoRef.current) return;

    const codeReader = new BrowserMultiFormatReader();

    codeReader
      .decodeFromVideoDevice(
        undefined, // undefined = use default camera
        videoRef.current,
        (result: Result | undefined, error: unknown, controls: IScannerControls) => {
          if (result) {
            setScanned(result.getText());
            console.log("Scanned:", result.getText());
            alert(result.getText())
          }
          
          // Store controls so we can stop later
          controlsRef.current = controls;
        }
      )
      .catch((err) => {
        console.error("ZXing error:", err);
      });

    // Cleanup on unmount: stop camera
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        className="w-full h-auto border rounded"
        autoPlay
        muted
      />
      <p className="mt-2">Scanned: {scanned}</p>
    </div>
  );
}
