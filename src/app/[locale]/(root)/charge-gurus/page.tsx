import { ChargeGurusPage } from "@/modules/charge-gurus/charge-gurus-page"

type Props = {
    searchParams: Promise<{ origin?: string }>
}

export async function ChargeGurus({ searchParams }: Props) {
    const { origin } = await searchParams

    return <ChargeGurusPage origin={origin} />
}