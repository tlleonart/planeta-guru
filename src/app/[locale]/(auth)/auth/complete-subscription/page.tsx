type Props = {
  searchParams: Promise<{ userId: string }>;
};

export default async function CompleteSubscription({ searchParams }: Props) {
  const { userId } = await searchParams;

  return <div>CompleteSubscription {userId}</div>;
}
