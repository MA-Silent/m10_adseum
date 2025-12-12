import { useTranslations } from "next-intl";
import { CmsComponent } from "./componentType";

const Text: CmsComponent = function ({children, style}) {
  const t = useTranslations('Homepage')
  const number = 3;

  return (
    <div
      className="relative w-full grid sm:grid-cols-(--length) not-sm:grid-rows-(--length) not-sm:gap-5 justify-items-center"
      style={ {...style, "--length": `repeat(${number},minmax(0,1fr))` } as React.CSSProperties}
    >
      {Array.from({ length: number }).map((_,index) => (
        <div key={index} className="w-1/2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque numquam earum error, soluta sequi, maiores harum vero dolores dolor alias dolore itaque? Doloribus aperiam eos repellendus harum. Ab, eaque dolorum.</div>
      ))}
      {children}
    </div>
  );
}

export default Text;
