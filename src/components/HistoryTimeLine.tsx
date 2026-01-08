import { CmsComponent } from "./componentType";

const HistoryTimeLine: CmsComponent = async function ({ children, id, style}) {
  return (
    <section className="w-full h-16 bg-red-500 relative justify-center flex items-center" style={style} id={id}>
      {children}

      <div className="bg-chart-3 h-0.5 w-[75%]" />

    </section>
  )
}

export default HistoryTimeLine;
