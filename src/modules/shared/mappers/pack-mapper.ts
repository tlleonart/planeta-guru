import { GuruPackCountryPrice, GuruPackCountryPriceApiModel, Pack, PackApiModel, PackList, PackListApiModel } from "../types/pack-types";

export function mapGuruPackCountryPrice(api: GuruPackCountryPriceApiModel): GuruPackCountryPrice {
    return {
        guruPackId: api.guru_pack_id,
        countryId: api.country_id,
        currencyId: api.currency_id,
        price: api.price,
        transactionCost: api.transaction_cost,
        transactionPercentage: api.transaction_percentage,
        totalPrice: api.total_price
    }
}

export function mapPack(api: PackApiModel): Pack {
    return {
        id: api.id,
        name: api.name,
        guruAmount: api.guru_amount,
        usdAmount: api.usd_amount,
        countryId: api.country_id,
        offered: api.offered,
        prices: mapGuruPackCountryPrice(api.prices)
    }
}

export function mapPackList(api: PackListApiModel): PackList {
    return api.map(mapPack)
}