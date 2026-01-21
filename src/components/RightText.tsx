import CmsImage from "../devComponents/CmsImage";
import { CmsComponent } from "./componentType"
import Text from "./Text";

const LeftText: CmsComponent = async function ({id, children, style, onCMS}) {

  const component_id: number = parseInt( id.split(':')[1] );

  return (
    <section style={style} id={id} className="relative w-full p-6 z-0">
      <div className="flex items-center justify-around not-sm:flex-wrap">
        <CmsImage height={500} width={500} onCMS={ onCMS } componentID={component_id} />
        <Text onCMS={ onCMS } data={{ length: 1, className: "max-w-128"}} id={id}>{children}</Text>
      </div>
      {children}
    </section>
  )
}

export default LeftText;
