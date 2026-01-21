import {CmsComponent} from "./componentType"
import Text from "./Text";

const LeftText: CmsComponent = async function ({id, children, style, onCMS}) {

  return (
    <section style={style} id={id} className="relative w-full p-6 z-0">
      <div className="flex items-center justify-around not-sm:flex-wrap">
        <Text onCMS={ onCMS } data={{ length: 1, className: "max-w-128"}} id={id}>{children}</Text>
        <section className="bg-red-500 size-32" />
      </div>
      {children}
    </section>
  )
}

export default LeftText;
