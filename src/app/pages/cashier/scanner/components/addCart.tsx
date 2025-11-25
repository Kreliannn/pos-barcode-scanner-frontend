"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState , useEffect} from "react";
import { Plus, Minus } from "lucide-react";
import { productInterface } from "@/app/types/product.type";
import useCartStore from "@/app/store/useCartStore";
import { transactionOrderInterface } from "@/app/types/transactions.typ";
import { successAlert } from "@/app/utils/alert";



export function AddCart({ product }: { product: productInterface }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(product.variants[0].variant);
  const [index, setIndex] = useState(0);

  const {addOrder} = useCartStore()


  useEffect(() => {
    product.variants.forEach((item, index) => {
      if(item.variant == variant){
        setIndex(index)
        setVariant(variant)
      }
    })
  }, [variant])


  const addCartHandler = () => {
    const newOrder : transactionOrderInterface = {
        name :  product.name,
        barcode : product.variants[index].barcode,
        variant :  product.variants[index].variant,
        price :  product.variants[index].price,
        qty : quantity,
        total :   (product.variants[index].price * quantity),
    }
    addOrder(newOrder)
    setOpen(false)
    successAlert("order added")
    setIndex(0)
    setVariant(product.variants[0].variant)
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(value > 0 ? value : 1);
  };


  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="absolute w-full h-full top-0 left-0 opacity-0"
            onClick={() => setOpen(true)}
          ></Button>
        </DialogTrigger>
        <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>   
             
            </DialogDescription>
          </DialogHeader>
        <DialogContent className="sm:max-w-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Column - Image */}
            <div className="w-full h-64 relative rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>        

            {/* Second Column - Details */}
            <div className="space-y-4">

              {/* Name */}
              <div className="flex gap-10">
                <h2 className="text-xl font-semibold">{product.name}</h2> 
                <p className="text-xl font-medium text-green-600">₱{product.variants[index].price}</p>
              </div>

              <div className=""> 
       
                <div className="space-y-1">
                  <label htmlFor="menu-type" className="text-sm font-medium text-gray-700">
                    Product Variants
                  </label>
                  <Select value={variant} onValueChange={setVariant}>
                      <SelectTrigger className="border px-3 py-2 rounded bg-white text-sm w-full">
                        <SelectValue placeholder="Select Variant" />
                      </SelectTrigger>
                      <SelectContent>
                          {product.variants.map((item, index) => (
                            <SelectItem key={index} value={item.variant}> {item.variant} </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                </div>


              </div>

              {/* Quantity */}
              <div className="space-y-2 ">
                <h3 className="text-sm font-medium">Quantity</h3>
                <div className="flex items-center space-x-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decrementQuantity}
                    className="w-1/6 h-8 p-0 bg-red-500 text-white hover:bg-red-600 hover:text-white"
                  >
                      <Minus />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min={1}
                    className="w-4/6 text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={incrementQuantity}
                    className="w-1/6 h-8 p-0 bg-green-500 text-white hover:bg-green-600 hover:text-white"
                  >
                    <Plus />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                  <Button className="w-full " onClick={addCartHandler}> Add To Cart </Button>
              </div>

            </div>
          </div>
        </DialogContent>
      </Dialog>

     
    </>
  );
}