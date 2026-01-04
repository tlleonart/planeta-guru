import type { FC } from "react";
import { CategoryByIdWrapper } from "./components/category-by-id-wrapper";
import { Section } from "@/modules/shared/components/ui/section";

interface CategoryByIdPageProps {
    id: string;
}

export const CategoryByIdPage: FC<CategoryByIdPageProps> = ({ id }) => {
    return (
        <main>
            <Section className="h-full pt-16 mb-4">
                <CategoryByIdWrapper id={id} />
            </Section>
        </main>
    )
}