import { HTMLAttributes } from "react";
import {
  BackgroundProps,
  BorderProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  GridProps as _GridProps,
  ColorProps,
} from "styled-system";
import { TypographyProps } from "styled-system";
import { PropsWithChildren } from "react";


export interface BoxProps
  extends BackgroundProps,
    BorderProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    Omit<ColorProps, "color">,
    HTMLAttributes<HTMLElement> {}

export interface FlexProps extends BoxProps, FlexboxProps {}

export interface GridProps extends FlexProps, _GridProps {}

export const tags = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
};

export const scales = {
  MD: "md",
  LG: "lg",
  XL: "xl",
  XXL: "xxl",
} as const;

export type Tags = (typeof tags)[keyof typeof tags];
export type Scales = (typeof scales)[keyof typeof scales];

export interface HeadingProps {
  as?: Tags;
  scale?: Scales;
}


interface Props extends SpaceProps, TypographyProps, LayoutProps {
  color?: string;
  bold?: boolean;
  small?: boolean;
  ellipsis?: boolean;
  textTransform?: "uppercase" | "lowercase" | "capitalize";
}

export type TextProps = PropsWithChildren<Props>;

