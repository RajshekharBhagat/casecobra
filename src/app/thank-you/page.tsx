import { Suspense } from "react";
import ThankYou from "./ThankYou";
import { notFound } from "next/navigation";

const Page = () => {

   

    return <Suspense>
        <ThankYou />
    </Suspense>
}

export default Page;