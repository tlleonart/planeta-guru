import { FC } from "react"
import { Section } from "@/modules/shared/components/ui/section"
import { HelpBanner } from "./components/help-banner"
import { HelpWelcome } from "./components/help-welcome"
import { HelpGrid } from "./components/help-grid"

export const HelpPage: FC = () => {
    return (
        <main>
            <Section className="h-full pt-16">
                <HelpBanner />
            </Section>
            <Section className="mb-4">
                <HelpWelcome />
            </Section>
            <Section className="mb-8">
                <HelpGrid />
            </Section>
        </main>
    )
}
