import { CSSProperties } from "react";

type PropsWithRequiredChildren<P = {}> = P & {
  children: React.ReactNode;
  style?: CSSProperties
}

export type CmsComponent<P = {}> = (props: PropsWithRequiredChildren<P>) => React.ReactNode | Promise<React.ReactNode>;
