"use client"

import { useEffect, useRef, useState } from "react";
import { useCms } from "./CmsContext";
import { CmsComponent } from "../../../components/componentType";
import { useTranslations } from "next-intl";

const TextInput: CmsComponent = ({children, id, style}) => {
  const [content, setContent] = useState("");
  const { addAction } = useCms();
  const ref = useRef(null)
  const componentInfo = id.split(':');
  const componentID: number = parseInt(componentInfo[1].replace(/-(.*)/gi, ''));

  const t = useTranslations('components');
  let text = "";

  if(t.has(`${id}.content`)){
    text = t(`${id}.content`);
  }else{
    text = "Please enter text here";
  }

  useEffect(()=>{
    if (!ref.current) return;
    const element: HTMLTextAreaElement = ref.current;

    element.style.height = element.scrollHeight + 'px';
  },[ref])

  return (
    <div className="relative size-fit w-full" id={id} style={style}>
      {children}
        <form className="size-full" onSubmit={(e) => { e.preventDefault(); addAction({ type: 'InsertText', key: id, componentID: componentID ,contentEN: content }) }}>
        <textarea name="Text" ref={ref} placeholder="Insert text here" className="size-full resize-none min-h-[1em]" onInput={(e)=>{e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'}} onChange={(e) => setContent(e.currentTarget.value)} defaultValue={text}></textarea>
          {content && content != text && <button type="submit" className="bg-chart-2">Done</button>}
        </form>
    </div>
  )
}

export default TextInput;
