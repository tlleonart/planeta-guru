import { api } from "@/app/server/server"
import { FC } from "react"
import { Section } from "../shared/components/ui/section"
import { SearchWrapper } from "./components/search-wrapper"

interface SearchPageProps {
    query: string
}

export const SearchPage: FC<SearchPageProps> = async ({ query }) => {
    const products = await api.product.search({ query })

    return (
        <Section className="h-full pt-16 mb-4">
            <SearchWrapper products={products.items} />
        </Section>
    )
}