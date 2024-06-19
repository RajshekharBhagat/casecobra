import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";
import sharp from "sharp";
import { dbConnect } from "@/lib/dbConnect";
import ConfigurationModel from "@/models/configuration";
const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(
      z.object({
        configId: z.string().optional(),
      })
    )
    .middleware(async ({ input }) => {
      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input;

      const res = await fetch(file.url);
      const buffer = await res.arrayBuffer();

      const imageMetaData = await sharp(buffer).metadata();
      const { width, height } = imageMetaData;
      await dbConnect();
      if (!configId) {
        const configuration = new ConfigurationModel({
          imageUrl: file.url,
          height: height || 500,
          width: width || 500,
        });
        await configuration.save();
        return { configId: configuration?._id as string};
      } else {
        const updatedConfiguration = await ConfigurationModel.findByIdAndUpdate(
          configId,
          {
            configuredImageUrl: file.url,
          },
          {
            new: true,
          }
        );
        return { configId: updatedConfiguration?._id as string };
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
