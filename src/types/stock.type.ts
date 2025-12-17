interface StockData{
    productId:string,
    userId:string,
    qty:number,
    note?:string
}

interface Data{
    data:StockData
}

export type {Data}