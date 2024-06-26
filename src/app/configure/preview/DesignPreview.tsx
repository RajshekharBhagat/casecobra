"use client";
import LoginModel from "@/components/LoginModel";
import Phone from "@/components/Phone";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { cn, formatPrice } from "@/lib/utils";
import { Configuration } from "@/models/configuration";
import { COLORS, MODELS } from "@/validator/options-validator";
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { createCheckOutSession } from "./action";

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const router = useRouter();
  const {toast} = useToast();
  const {user} = useKindeBrowserClient();
  const [isLoginModelOpen, setIsLoginModelOpen] = useState<boolean>(false);
  const { caseColor, phoneModel, caseFinish, caseMaterial, _id } = configuration;
  const tw = COLORS.find(
    (supportedColor) => supportedColor.value === caseColor
  )?.tw;
  const { label: modelLabel } = MODELS.options.find(
    ({ value }) => value == phoneModel
  )!;
  
  useEffect(() => setShowConfetti(true),[]);
  let totalPrice = BASE_PRICE;
  if(caseMaterial === 'polycarbonate') {
    totalPrice += PRODUCT_PRICES.material.polycarbonate;
  }
  if(caseFinish === 'textured') {
    totalPrice += PRODUCT_PRICES.finish.textured
  }

  const { mutate: createPaymentSession, isPending } = useMutation({
    mutationKey: ['get-checkout-session'],
    mutationFn: createCheckOutSession,
    onSuccess: ({url}) => {
      if(url) {
        router.push(url);
      } else {
        throw new Error('Unable to retrieve payment URL');
      }
    },
    onError: (error) => {
      toast({
        title: 'Something went wrong',
        description: 'There was an error on our end. Please try again.',
        variant: 'destructive',
      })
    }
  });

  const handleCheckout = async() => {
    if(user) {
      createPaymentSession({configId: _id as string})
    } else {
      localStorage.setItem('configurationId', _id as string);
      setIsLoginModelOpen(true);
    }
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti
          active={showConfetti}
          config={{
            elementCount: 200,
            spread: 90,
          }}
        />

        <LoginModel isOpen={isLoginModelOpen} setIsOpen={setIsLoginModelOpen} />

      </div>
      <div className="mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          <Phone
            imgSrc={configuration.configuredImageUrl}
            className={cn(`bg-${tw}`)}
          />
        </div>
        <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {modelLabel} Case
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            In stock and ready to ship.
          </div>
        </div>
        <div className="sm:col-span-12 md:col-span-9 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950 ">Highlights</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Wireless charging compatible</li>
                <li>TPU shock absorption</li>
                <li>Packaging made from recycled material</li>
                <li>5 year print warranty</li>
              </ol>
            </div>
            <div>
              <p className="font-medium text-zinc-950">
                Materials
                <ol className="list-disc text-zinc-700 list-inside mt-3">
                  <li>High-quality, durable material</li>
                  <li>Scratch and fingerprint resistant coating</li>
                </ol>
              </p>
            </div>
          </div>
          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">Base Price</p>
                  <p className="font-medium text-gray-900 ">
                    {formatPrice(BASE_PRICE)}
                  </p>
                </div>
                {caseFinish === "textured" ? (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Textured Finish</p>
                    <p className="font-medium text-gray-900 ">
                      {formatPrice(PRODUCT_PRICES.finish.textured)}
                    </p>
                  </div>
                ) : null}
                {
                   caseMaterial === 'polycarbonate' ? (
                    <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Soft Polycarbonate Material</p>
                    <p className="font-medium text-gray-900 ">
                      {formatPrice(PRODUCT_PRICES.material.polycarbonate)}
                    </p>
                  </div>
                  ) : null
                }
                <div className="my-2 bg-gray-200 h-px" />
                <div className=" flex items-center py-2 justify-between">
                  <p className="font-semibold text-gray-900">
                    Order Total
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(totalPrice)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-8 pb-12">
              <Button disabled={isPending} isLoading={isPending} loadingText="Checking Out" onClick={() => handleCheckout()} className="px-4 sm:px-6 lg:px-8">Check Out <ArrowRight className="h-4 w-4 ml-1.5 inline" /></Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesignPreview;
