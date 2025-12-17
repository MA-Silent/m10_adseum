"use client"

import { useState } from "react";
import { useCms } from "./CmsContext";
import { CmsComponent } from "../../../components/componentType";
import { useTranslations } from "next-intl";

const TextInput: CmsComponent = ({children, id, style}) => {
  const [content, setContent] = useState("");
  const { addAction } = useCms();
  const componentInfo = id.split(':');
  const componentID: number = parseInt(componentInfo[1].replace(/-(.*)/gi, ''));

  const t = useTranslations('components');
  let text = "";

  if(t.has(`${id}.content`)){
    text = t(`${id}.content`);
  }else{
    text = "Please enter text here";
  }

  return (
    <div className="relative w-full" id={id} style={style}>
      {children}
        <form className="size-full" onSubmit={(e) => { e.preventDefault(); addAction({ type: 'InsertText', key: id, componentID: componentID ,contentEN: content }) }}>
          <textarea name="Text" id="" placeholder="Insert text here" className="size-full resize-none" onChange={(e) => setContent(e.currentTarget.value)} defaultValue={text}></textarea>
          {content && <button type="submit" className="bg-chart-2">Done</button>}
        </form>
    </div>
  )
}

export default TextInput;
