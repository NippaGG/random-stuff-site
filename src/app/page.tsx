import { getItems } from "@/lib/items-server";
import PageClientWrapper from "@/components/PageClientWrapper";
import ClientPageLayout from "@/components/ClientPageLayout";

export default async function Home() {
  const items = await getItems();

  return (
    <PageClientWrapper>
      <ClientPageLayout items={items} />
    </PageClientWrapper>
  );
}
