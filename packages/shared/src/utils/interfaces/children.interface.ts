import { ReactNode } from "react";

interface Children {
    children: ReactNode,
    onClick?: () => void,

}

export type childrenInterface<T = {}> = Children & Partial<T>;
  