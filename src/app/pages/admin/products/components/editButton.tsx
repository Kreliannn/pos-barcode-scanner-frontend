"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, type ChangeEvent, useEffect } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "@/app/utils/axios"
import { ImageIcon , X} from "lucide-react"
import { confirmAlert, errorAlert, successAlert } from "@/app/utils/alert";
import { productInterface, productInterfaceInput, productVariantInterface } from "@/app/types/product.type"
import { Label } from "@/components/ui/label"

export function EditButton({ setProduct, product } : { product : productInterface, setProduct : React.Dispatch<React.SetStateAction<productInterface[]>>}) {
  const [open, setOpen] = useState(false)
  const [productName, setProductName] = useState(product.name)
  const [productVariants, setProductVariants] = useState<productVariantInterface[]>(product.variants)



  const mutation = useMutation({
    mutationFn: (data: productInterface) =>
      axiosInstance.put(`/product/${data._id}`, data),
    onSuccess: (response) => {
      successAlert("save changes")
      setProduct(response.data)
      setOpen(false)
    },
    onError: (err) => {
      errorAlert("error")
    },
  })




  const handleSubmit = async () => {
    if (!productName) return errorAlert("empty input field")
    mutation.mutate({
        _id : product._id,
        name : productName,
        variants : productVariants,
        image : product.image
    })
  }


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger onClick={() => setOpen(true)} asChild>
            <Button className=" absolute w-full h-full top-0 left-0 opacity-0 "  onClick={() => setOpen(true)}>
                    
            </Button>
      </SheetTrigger>
  
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Add New Product</SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Fill in the details below to add a new Product.
          </SheetDescription>
        </SheetHeader>
  
        <div className="rounded-lg bg-white mx-auto max-h-[500px] overflow-auto p-6 space-y-6 border h-[500px]">
          {/* Product Name */}
          <div className="space-y-1">
            <label htmlFor="product-name" className="text-sm font-medium text-gray-700">
              Product Name
            </label>
            <Input
              id="product-name"
              type="text"
              placeholder=""
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

         

          {/* Product Variants */}
          <div className="space-y-4">
            {/* Header + Add Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <Label>Variants</Label>
              <Button
                size="sm"
                className="mb-2 sm:mb-0"
                onClick={() =>
                  setProductVariants([
                    ...productVariants,
                    { variant: "", price: 0, stocks: 0, barcode: "123" },
                  ])
                }
              >
                Add Variant
              </Button>
            </div>

            {productVariants.map((variant, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                {/* Variant Name */}
                <div className="sm:col-span-4">
                  <Label className="text-xs mb-1">Name</Label>
                  <Input
                    placeholder="Small, Medium, Large"
                    value={variant.variant}
                    onChange={(e) => {
                      const newVariants = [...productVariants];
                      newVariants[index].variant = e.target.value;
                      setProductVariants(newVariants);
                    }}
                  />
                </div>

                {/* Price */}
                <div className="sm:col-span-3">
                  <Label className="text-xs mb-1">Price</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={variant.price}
                    min={0}
                    onChange={(e) => {
                      const newVariants = [...productVariants];
                      newVariants[index].price = Number(e.target.value);
                      setProductVariants(newVariants);
                    }}
                  />
                </div>

                {/* Stocks */}
                <div className="sm:col-span-3">
                  <Label className="text-xs mb-1">Stocks</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={variant.stocks}
                    min={0}
                    onChange={(e) => {
                      const newVariants = [...productVariants];
                      newVariants[index].stocks = Number(e.target.value);
                      setProductVariants(newVariants);
                    }}
                  />
                </div>

                {/* Remove Button */}
                {productVariants.length > 1 && (
                  <div className="sm:col-span-2 ">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newVariants = productVariants.filter((_, i) => i !== index);
                        setProductVariants(newVariants);
                      }}
                     
                    >
                      <X />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <SheetFooter className="mt-4 flex gap-2">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">Cancel</Button>
          </SheetClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
  
}
