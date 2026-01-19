import { HeaderComponent } from "@/modules/shared/components/header/header-component";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <>
      <HeaderComponent />
      <main className="flex-grow">{children}</main>
    </>
  );
}
