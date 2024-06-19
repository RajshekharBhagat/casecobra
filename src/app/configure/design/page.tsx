import ConfigurationModel from "@/models/configuration";
import { notFound } from "next/navigation";
import DesignConfigurator from "./DesignConfigurator";
import { dbConnect } from "@/lib/dbConnect";

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

  if (!configuration || !configuration._id) {
    return notFound();
  }

  const { imageUrl, width, height } = configuration;

  return (
    <DesignConfigurator
      configId={configuration._id as string}
      imageDimension={{ width, height }}
      imageUrl={imageUrl}
    />
  );
};

export default Page;
