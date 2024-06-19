import { dbConnect } from "@/lib/dbConnect";
import ConfigurationModel from "@/models/configuration";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ searchParams }: PageProps) => {
  await dbConnect();

  const { id } = searchParams;
  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await ConfigurationModel.findById(id);

  if(!configuration) {
    return notFound();
  }

  return (
    <div>
      <DesignPreview configuration={configuration}/>
    </div>
  );
};

export default Page;
