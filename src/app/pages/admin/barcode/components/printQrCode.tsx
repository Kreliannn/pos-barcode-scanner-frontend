"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Printer } from "lucide-react"
import Barcode from "./barcode"
import { useState } from "react";
import { printOneQr, printManyQr } from "@/app/utils/barcode"
import QRCodeComponent from "./qrcode"
 

export function PrintQrCode({ barcode, name, variant , img } : { barcode : string, name : string, variant : string, img : string} ) {

  const [open, setOpen] = useState(false);

 

    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
            <Button size={"sm"} onClick={() => setOpen(true)}> <Printer /> </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>product : {name}</DialogTitle>
          <DialogDescription>   
           variant : {variant}
          </DialogDescription>
        </DialogHeader>

    
        <div className=" gap-6 mb-6">
            <div className="w5/6 m-auto grid grid-cols-1 md:grid-cols-2 mb-5">
                <div className="w-auto h-auto">
                  <img
                    src={img}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <QRCodeComponent value={barcode} />
            </div>

            <div className="flex gap-3">
                <Button onClick={() => printOneQr(barcode, { title: name, imgWidth: 500 })}>
                    One Copy
                </Button>

                <Button onClick={() => printManyQr(barcode, 70, { cols: 5, imgWidth: 180, gapMm: 6 })}>
                    Many Copy
                </Button>
            </div>
           
        </div>
      </DialogContent>
    </Dialog>
  )
}
