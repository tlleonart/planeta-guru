import { SearchPage } from "@/modules/search/search-page";

type Props = {
  params: Promise<{ query: string }>;
};

export default async function Search({ params }: Props) {
  const { query } = await params;

  return <SearchPage query={query} />;
}
