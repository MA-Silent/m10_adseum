import { CmsComponent } from "./componentType";
import TextInput from "../app/cms/cmsComponents/TextInput";
import { getDynamicText } from "../lib/pages";
import * as React from "react"

const Text: CmsComponent = async function ({children, id, style}) {
  const number = 3;

  return (
    <div
      id={id}
      className="relative w-full grid sm:grid-cols-(--length) not-sm:grid-rows-(--length) not-sm:gap-5 justify-items-center"
      style={ {...style, "--length": `repeat(${number},minmax(0,1fr))` } as React.CSSProperties}
    >
      {await Promise.all(Array.from({ length: number }).map(async (_, index) => {
        let text = "";
        text = await getDynamicText(`${id}-${index}`)
        let cms: boolean = false;
        // @ts-expect-error type does exist
        if(children && !(typeof(children.type) == 'symbol')){
          cms = true
        }

        return (
          !cms ? <div key={index} className="w-1/2">{text}</div> : <div key={index}><TextInput id={`${id}-${index}`}><></></TextInput></div>
        )
      }) || [])}
      <div>
        {children}
      </div>
    </div>
  );
}

export default Text;
