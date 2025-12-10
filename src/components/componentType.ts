type PropsWithRequiredChildren<P = {}> = P & {
  children: React.ReactNode;
}

export type CmsComponent<P = {}> = (props: PropsWithRequiredChildren<P>) => React.ReactNode | Promise<React.ReactNode>;
