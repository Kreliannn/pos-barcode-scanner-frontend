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
import { errorAlert, successAlert } from "@/app/utils/alert";
import { productInterface, productInterfaceInput, productVariantInterface } from "@/app/types/product.type"
import { Label } from "@/components/ui/label"

export function AddButton({ setProduct } : { setProduct : React.Dispatch<React.SetStateAction<productInterface[]>>}) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [productName, setProductName] = useState("")
  
  const [productVariants, setProductVariants] = useState<productVariantInterface[]>([
    {
      variant : "",
      price : 0,
      stocks : 0,
      barcode : "123",
    }
  ])


  const [imagePreview, setImagePreview] = useState<string | null>(null)


  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      axiosInstance.post("/product", formData, { headers: { "Content-Type": "multipart/form-data" } }),
    onSuccess: (response) => {
      successAlert("product added")
      setProduct(response.data)
      setProductName("")
      setFile(null)
      setImagePreview(null)
      setOpen(false)
    },
    onError: (err) => {
      errorAlert("error")
    },
  })

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
  
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
  
      setFile(null);
      setImagePreview(null);
    }
  };

  


  const handleSubmit = async () => {
    if (!file || !productName) return errorAlert("empty input field")

    const formData = new FormData()

  
    formData.append("file", file)
    formData.append("name", productName)
    formData.append("variants", JSON.stringify(productVariants))

    mutation.mutate(formData)
  }


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger onClick={() => setOpen(true)} asChild>
        <Button >Add Product</Button>
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

  {/* Image Upload */}
  <div className="w-full flex flex-col sm:flex-row gap-4">
    {/* Upload */}
    <div className="flex-1 space-y-1">
      <label htmlFor="product-image" className="text-sm font-medium text-gray-700">
        Product Image
      </label>
      <input
        id="product-image"
        type="file"
        onChange={handleFileChange}
        className="w-full file:px-3 file:py-1.5 file:rounded file:border file:bg-gray-100 file:text-gray-700 file:cursor-pointer"
        accept="image/*"
      />
    </div>

    {/* Preview */}
    <div className="w-full sm:w-24 flex-shrink-0">
      <p className="text-sm font-medium text-gray-700 mb-1">Image Preview</p>
      {imagePreview ? (
        <div className="w-24 h-24 border-2 border-dashed rounded-lg overflow-hidden">
          <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
        </div>
      ) : (
        <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg text-gray-400 bg-gray-50">
          <ImageIcon className="h-12 w-12" />
        </div>
      )}
    </div>
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
        <div className="sm:col-span-6">
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
        <div className="sm:col-span-2">
          <Label className="text-xs mb-1">Price</Label>
          <Input
            type="number"
            placeholder="0"
            value={variant.price}
            onChange={(e) => {
              const newVariants = [...productVariants];
              newVariants[index].price = Number(e.target.value);
              setProductVariants(newVariants);
            }}
          />
        </div>

        {/* Stocks */}
        <div className="sm:col-span-2">
          <Label className="text-xs mb-1">Stocks</Label>
          <Input
            type="number"
            placeholder="0"
            value={variant.stocks}
            onChange={(e) => {
              const newVariants = [...productVariants];
              newVariants[index].stocks = Number(e.target.value);
              setProductVariants(newVariants);
            }}
          />
        </div>

        {/* Remove Button */}
        {productVariants.length > 1 && (
          <div className="sm:col-span-2">
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
            {mutation.isPending ? "Saving..." : "Save Menu"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
  
}
