export interface transactionOrderInterface  {
    name :  string,
    barcode : string,
    variant : string,
    price : number,
    qty : number,
    total :  number,
}

export interface transactionInterfaceInput {
    orders: transactionOrderInterface[],
    total: number,
    vat: number,
    date: string,
    cashier: string,
}


export interface transactionInterface extends transactionInterfaceInput {
    _id : string
}