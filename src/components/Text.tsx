import { CmsComponent } from "./componentType";
import TextInput from "../app/cms/cmsComponents/TextInput";
import { getDynamicText } from "../lib/pages";
import * as React from "react"

const Text: CmsComponent = async function ({ children, id, style, data, onCMS }) {
  //@ts-expect-error might exist
  const number = (data?.length || 3);

  return (
    <div
      id={id}
      className="relative w-auto grid sm:grid-cols-(--length) not-sm:grid-rows-(--length) not-sm:gap-5 justify-items-center"
      style={ {...style, "--length": `repeat(${number},minmax(0,1fr))` } as React.CSSProperties}
    >
      {await Promise.all(Array.from({ length: number }).map(async (_, index) => {
        let text = "";
        text = await getDynamicText(`${id}-${index}`)

        return (
          //@ts-expect-error it may exist
          !onCMS ? <div className={data?.className || ""} key={index}>{text}</div> : <div key={index}><TextInput onCMS={ onCMS } id={`${id}-${index}`}><></></TextInput></div>
        )
      }) || [])}
      <div>
        {number == 3 ? children : null }
      </div>
    </div>
  );
}

export default Text;
