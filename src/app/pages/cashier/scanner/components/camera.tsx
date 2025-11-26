"use client";

import { useCallback } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import type { Result } from "@zxing/library";
import { BarcodeStringFormat } from "react-qr-barcode-scanner";
import { productInterface } from "@/app/types/product.type";
import useCartStore from "@/app/store/useCartStore";
import { successAlert , confirmAlert} from "@/app/utils/alert";
import { transactionOrderInterface } from "@/app/types/transactions.typ";
import Swal from "sweetalert2";

export default function BarcodeScanner({ products  } : { products : productInterface[] }) {

  const { addOrder } = useCartStore()

  const addCartModal = (product : productInterface, index : number) => {
    Swal.fire({
      title: "Add to Cart?",
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <img src="${product.image}" alt="${product.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
          <strong>${product.name}</strong>
          <div style="display: flex; align-items: center; gap: 8px;">
             <span> ${product.variants[index].variant}</span>
             <span> ₱${product.variants[index].price}</span>
          </div>
         
           <input 
              type="number" 
              id="quantity" 
              class="swal2-input" 
              value="1" 
              min="1" 
              style="width: 150px; text-align: center;"
            />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Add to Cart",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: () => {
        const quantityInput = Swal.getPopup()?.querySelector<HTMLInputElement>('#quantity');
        if (!quantityInput || Number(quantityInput.value) < 1) {
          Swal.showValidationMessage('Quantity must be at least 1');
          return;
        }
        return Number(quantityInput.value);
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const qty = result.value ?? 1; // the input value
        const newOrder: transactionOrderInterface = {
          name: product.name,
          barcode: product.variants[index].barcode,
          variant: product.variants[index].variant,
          price: product.variants[index].price,
          qty,
          total: product.variants[index].price * qty,
        };
        addOrder(newOrder);
    
        Swal.fire("Added!", `${product.name} has been added to cart.`, "success");
      }
    });
    
  };

  const scanBarcodeHandler = useCallback(
    (err: unknown, result?: Result) => {
      if (result) {
        const code = result.getText();
        products.forEach((product) => {
          product.variants.forEach((variant, index) => {
            if(code == variant.barcode){
              addCartModal(product, index)
            }
          })
        })
      }
    },
    []
  );

  return (
    <div className="w-full  bg-black">
      <BarcodeScannerComponent
        width="100%"
        height="100%"
        facingMode="environment"
        formats={[BarcodeStringFormat.QR_CODE]}
        onUpdate={scanBarcodeHandler}
      />
    </div>
  );
}
