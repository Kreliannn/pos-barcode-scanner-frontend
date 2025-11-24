"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { Result } from "@zxing/library";

export default function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    // List all cameras
    BrowserMultiFormatReader.listVideoInputDevices()
      .then((videoDevices) => {
        // Try to select a rear camera automatically
        const rearCamera = videoDevices.find((d) =>
          /back|rear|environment/gi.test(d.label)
        );
        setDeviceId(rearCamera?.deviceId || videoDevices[0]?.deviceId || null);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!deviceId || !videoRef.current) return;

    const codeReader = new BrowserMultiFormatReader();

    codeReader
      .decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result?: Result, err?: unknown) => {
          if (result) {
            const code = result.getText();
            console.log("SCANNED:", code);
            alert(code);
          }
        }
      )
      .then((controls) => {
        controlsRef.current = controls;
      })
      .catch(console.error);

    // Cleanup on unmount
    return () => {
      if (controlsRef.current) controlsRef.current.stop();
    };
  }, [deviceId]);

  return (
    <div className="w-full h-[70vh] border">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
      />
    </div>
  );
}
