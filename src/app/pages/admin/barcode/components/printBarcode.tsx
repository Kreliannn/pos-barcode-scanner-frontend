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
import { printOne, printMany } from "@/app/utils/barcode"

 

export function PrintBarcode({ barcode, name, variant , img } : { barcode : string, name : string, variant : string, img : string} ) {

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
            <div className="flex mb-3 justify-center">
                <div className="">
                  <img
                    src={img}
                    alt={name}
                    className="w-[120px] h-[120px] object-cover"
                  />
                </div>

                <Barcode value={barcode} />
            </div>

            <div className="flex gap-3">
                <Button onClick={() => printOne(barcode, { title: name, imgWidth: 500 })}>
                    One Copy
                </Button>

                <Button onClick={() => printMany(barcode, 60, { cols: 5, title: name, imgWidth: 180, gapMm: 6 })}>
                    Many Copy
                </Button>
            </div>
           
        </div>
      </DialogContent>
    </Dialog>
  )
}
