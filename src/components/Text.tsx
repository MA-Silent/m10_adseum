"use client"
import { useTranslations } from "next-intl";
import { CmsComponent } from "./componentType";
import { useEffect, useRef, useState } from "react";
import TextInput from "../app/cms/cmsComponents/TextInput";

const Text: CmsComponent = function ({children, id, style}) {
  const t = useTranslations('components');
  const ref = useRef<HTMLDivElement>(null);
  const [cms, setCms] = useState(false);
  const number = 3;

  useEffect(()=>{
    if(ref.current?.children.length){
      setCms(true);
    }
  },[ref])



  return (
    <div
      id={id}
      className="relative w-full grid sm:grid-cols-(--length) not-sm:grid-rows-(--length) not-sm:gap-5 justify-items-center"
      style={ {...style, "--length": `repeat(${number},minmax(0,1fr))` } as React.CSSProperties}
    >
      {Array.from({ length: number }).map((_, index) => {
        let text = "";

        if( t.has(`${id}-${index}.content`) ){
          text = t(`${id}-${index}.content`);
        }else{
          text = "Please enter text here";
        }

        return (
          !cms ? <div key={index} className="w-1/2">{text}</div> : <div key={index}><TextInput id={`${id}-${index}`}><></></TextInput></div>
        )
      })}
      <div ref={ref}>
        {children}
      </div>
    </div>
  );
}

export default Text;
