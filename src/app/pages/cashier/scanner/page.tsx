"use client";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import { errorAlert, successAlert, confirmAlert } from "@/app/utils/alert";
import { productInterface } from "@/app/types/product.type";
import BarcodeScanner from "./components/camera";
import ProductList from "./components/products";
import Cart from "./components/cart";

export default function Page() {
  
  const [products, setProducts] = useState<productInterface[]>([])

  const { data } = useQuery({
      queryKey: ["product"],
      queryFn: () => axiosInstance.get("/product")
  })

  useEffect(() => {
      if(data?.data) setProducts(data?.data)
  }, [data])

  
  const [isTypeScanner, setIsTypeScanner] = useState(false)


  return (
    <div className="w-full h-dvh space-y-6 p-4 grid grid-cols-1 md:grid-cols-2 gap-2  ">

        <div className="w-full h-[140px] md:h-[650px]  ">
            <div className="flex h-[10%] mb-4 ">
                <div className={`p-3 border flex items-center justify-center ${!isTypeScanner ? "bg-green-500 text-white" : "bg-white text-stone-700"}`} onClick={() => setIsTypeScanner(false)}>
                    <h1 className="font-bold"> Product List </h1>
                </div>

                <div className={`p-3 border flex items-center justify-center  ${isTypeScanner ? "bg-green-500 text-white" : "bg-white text-stone-700"}`}  onClick={() => setIsTypeScanner(true)}>
                    <h1 className="font-bold"> Qrcode Scanner</h1>
                </div>
            </div>

            {(isTypeScanner) ? (<BarcodeScanner products={products} />) : (<ProductList products={products} />)}
        </div>

        <div className="w-full h-[250px] md:h-[650px] bg-stone-100">
            <Cart />
        </div>

    </div>
  );
}
