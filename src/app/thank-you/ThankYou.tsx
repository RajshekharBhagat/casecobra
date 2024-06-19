'use client';

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useQuery } from "@tanstack/react-query";
import { getPaymentStatus } from "./actions";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";


const ThankYou = () => {

  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';


  const {data} = useQuery({
    queryKey: ['get-payment-status-query'],
    queryFn: async() => await getPaymentStatus({orderId}),
    retry: true,
    retryDelay: 500,
  });

  if(data === undefined) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Loading your order...</h3>
          <p>This won't take long.</p>
        </div>
      </div>
    )
  }


  if(data === false) {
    return (
      <div className="w-full flex mt-24 justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    )
  }

  return (
      <MaxWidthWrapper>
        <div>

        </div>
      </MaxWidthWrapper>
  )
}

export default ThankYou
