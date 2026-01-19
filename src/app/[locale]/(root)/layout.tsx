import { FooterComponent } from "@/modules/shared/components/footer-component";
import { HeaderComponent } from "@/modules/shared/components/header/header-component";

type Props = {
  children: React.ReactNode;
};

export default function LocaleRootLayout({ children }: Props) {
  return (
    <>
      <HeaderComponent />
      <main className="grow">{children}</main>
      <FooterComponent />
    </>
  );
}
