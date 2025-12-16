import { FooterComponent } from "@/modules/shared/components/footer-component";
import { HeaderComponent } from "@/modules/shared/components/header/header-component";
import { MenuComponent } from "@/modules/shared/components/menu/menu-component";

type Props = {
  children: React.ReactNode;
};

export default function LocaleRootLayout({ children }: Props) {
  return (
    <>
      <MenuComponent />
      <HeaderComponent />
      <main className="grow">{children}</main>
      <FooterComponent />
    </>
  );
}
