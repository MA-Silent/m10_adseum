import { useTranslations } from "next-intl";

export default function Text() {
  const t = useTranslations('Homepage')
  const number = 3;

  return (
    <div
      className="w-full grid sm:grid-cols-(--length) not-sm:grid-rows-(--length) not-sm:gap-5 justify-items-center"
      style={{ "--length": `repeat(${number},minmax(0,1fr))` } as React.CSSProperties}
    >
      {Array.from({ length: number }).map((_,index) => (
        <div key={index} className="w-1/2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque numquam earum error, soluta sequi, maiores harum vero dolores dolor alias dolore itaque? Doloribus aperiam eos repellendus harum. Ab, eaque dolorum.</div>
      ))}
    </div>
  );
}
