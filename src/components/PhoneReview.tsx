'use client';

import { CaseColor } from "@/models/configuration";
import { useEffect, useRef, useState } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";
import { cn } from "@/lib/utils";

const PhonePreview = ({configuredImage, color}: {
    configuredImage: string,
    color: CaseColor
}) => {

    const ref = useRef<HTMLDivElement>(null);

    const [renderedDimension, setRenderedDimension] = useState({
        height: 0,
        width: 0,
    });

    let caseBackgroundColor = 'bg-zinc-950'
    if(color === 'blue') {
         caseBackgroundColor = 'bg-blue-950';   
    }
    if(color === 'rose') {
        caseBackgroundColor = 'bg-red-950'
    }

    const handleResize = () => {
        if(!ref.current) return;
        const {width, height} = ref.current.getBoundingClientRect();
        setRenderedDimension({width, height})
    }

    useEffect(() => {
        handleResize();

        window.addEventListener('resize',handleResize);
        return () => window.removeEventListener('resize',handleResize);
    },[ref.current])


    return (
        <AspectRatio ref={ref} ratio={3000/2001} className="relative">
            <div className="absolute z-20 scale-[1.0325]" style={{left: renderedDimension.width/2 - renderedDimension.width/(1216/121), top: renderedDimension.height / 6.22}}>
                <img src={configuredImage} alt="Case Preview" width={renderedDimension.width/(3000/637)} className={cn('phone-skew relative z-20 rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]',caseBackgroundColor)} />
            </div>
            <div className="relative h-full w-full z-40">
                <img alt="phone" src="/clearphone.png" className="pointer-events-none h-full w-full antialiased rounded-md" />
            </div>
        </AspectRatio>
    )
}

export default PhonePreview;