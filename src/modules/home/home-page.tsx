import type { FC } from "react";
import { Section } from "../shared/components/ui/section";
import { MainCarouselWrapper } from "./components/main-carousel-wrapper";
import { CategoryCarouselWrapper } from "./components/category-carousel-wrapper";
import { AdBannerWrapper } from "./components/ad-banner-wrapper";

export const HomePage: FC = () => {
  return (
    <main>
      <Section className="h-full md:h-screen pt-16 mb-8">
        <MainCarouselWrapper />
      </Section>
      <Section>
        <CategoryCarouselWrapper categoryId={7} />
        <CategoryCarouselWrapper categoryId={1} />
      </Section>
      <AdBannerWrapper />
      <Section className="mb-8">
        {
          [2, 3, 4, 6, 8, 5].map((categoryId) => (
            <CategoryCarouselWrapper key={categoryId} categoryId={categoryId} />
          ))
        }
      </Section>
    </main>
  );
};
