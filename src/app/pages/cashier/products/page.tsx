"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { backendUrl } from "@/app/utils/url";
import { Edit, Package, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/app/utils/axios";
import { productInterface } from "@/app/types/product.type";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";


export default function Page() {
    
    const [product, setProduct] = useState<productInterface[]>([])

    const { data } = useQuery({
        queryKey: ["product"],
        queryFn: () => axiosInstance.get("/product")
    })

    useEffect(() => {
        if(data?.data) setProduct(data?.data)
    }, [data])


    return (
            <div className="h-dvh w-full flex flex-col">
      
              {/* Header with Add Button */}
              <div className="w-full h-1/6 bg-white border-b shadow-sm flex items-center justify-between px-6">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                
              </div>
      
              {/* Content */}
              <div className="w-full h-5/6 bg-gray-100 overflow-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
      
                  {product.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white relative rounded-2xl shadow hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 group"
                    >
                      {/* Image Section */}
                      <div className="h-50 lg:h-72 bg-gray-100 relative overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
      
                        {/* Placeholder Icon */}
                        <div className={`absolute inset-0 flex items-center justify-center text-gray-400 ${item.image ? 'hidden' : ''}`}>
                          <Package className="w-12 h-12" />
                        </div>
                      </div>
      
                      {/* Content */}
                      <div className="p-4 space-y-1">
                        <h3 className="font-bold text-2xl text-gray-900 truncate mb-2">
                          {item.name}
                        </h3>

                        <div>
                          {/* Header */}
                          <div className="grid grid-cols-3 gap-4 mb-2">
                            <Label className="font-bold">Variants:</Label>
                            <Label className="font-bold">Price:</Label>
                            <Label className="font-bold">Stocks:</Label>
                          </div>

                          {/* Variants List */}
                          {item.variants.map((variant, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                              <Label className="text-stone-500">{variant.variant}</Label>
                              <Label className="text-green-500">₱{variant.price}</Label>
                              <Badge
                                className={
                                  variant.stocks > 10
                                    ? "bg-green-500"
                                    : variant.stocks > 5
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }
                              >
                                {variant.stocks}
                              </Badge>
                            </div>
                          ))}
                        </div>

                       


                    

                      </div>

                     
                    </div>
                  ))}
      
                </div>
      
                {/* Empty State */}
                {product.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    
                    <p className="text-xl font-semibold">No product Found</p>
                    <p className="text-sm">Add items product.</p>
                  </div>
                )}
              </div>
      
            </div>
         
       
      );
      
}