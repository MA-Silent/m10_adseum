import { CSSProperties } from "react";

type PropsWithRequiredChildren<P = {}> = P & {
  children: React.ReactNode
  id: string
  style?: CSSProperties
  data?: object
  onCMS: boolean
}

export type CmsComponent<P = {}> = (props: PropsWithRequiredChildren<P>) => React.ReactNode | Promise<React.ReactNode>;
