import { CategoryByIdPage } from "@/modules/categories/category-by-id/category-by-id-page";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CategoryId({ params }: Props) {
  const { id } = await params;

  return <CategoryByIdPage id={id} />;
}
