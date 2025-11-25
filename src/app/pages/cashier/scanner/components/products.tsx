"use client";

import { productInterface } from "@/app/types/product.type";
import { AddCart } from "./addCart";

export default function ProductList({ products }: { products: productInterface[] }) {
  return (
    <div className="w-full h-[210px] md:h-[87%] bg-stone-100 p-4 overflow-y-auto">
      <div className="flex flex-wrap gap-2 md:gap-3 ">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white shadow rounded-xl p-3 flex flex-col items-center w-[48%] lg:w-[23%] relative hover:scale-110"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-24 h-24 object-cover rounded-md mb-2"
            />
            <p className="text-sm font-medium text-gray-800 text-center">{p.name}</p>
            <AddCart product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
