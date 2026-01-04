import { FC } from "react"

interface PackCardProps {
    id: number
    value: string
    price: number
    transactionCost: number
    totalPrice: number
    origin?: string
    realIp?: string
}

export const PackCard: FC<PackCardProps> = ({ id, value, price, transactionCost, totalPrice, origin, realIp }) => {
    return (
        <div>
            <h2>{value}</h2>
            <p>{price}</p>
            <p>{transactionCost}</p>
            <p>{totalPrice}</p>
            <p>{origin}</p>
            <p>{realIp}</p>
        </div>
    )
}
