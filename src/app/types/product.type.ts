
export interface productVariantInterface {
  variant :  string,
  price : number,
  stocks : number,
  barcode : string,
}

export interface productInterfaceInput {
    name: string,
    variants: productVariantInterface[],
    image: string,
}

export interface productInterface extends productInterfaceInput {
    _id : string
}