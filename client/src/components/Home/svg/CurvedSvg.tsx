import styled, { css, DefaultTheme } from "styled-components";
import Box from "@/components/Box/Box";
import { ClipFill } from "../CurvedDivider";

interface CurveProps {
  clipFill?: ClipFill;
}

interface ContainerProps extends CurveProps {
  clipPath: string;
}

const sharedStyles = (
  theme: DefaultTheme,
  clipPath: string,
  clipFill?: ClipFill
) => css`
  width: 100%;
  height: 20px;
  clip-path: url(${clipPath});
  background: black;


  & svg {
    display: block;
  }
`;

// ${() => {
//     if (theme.isDark) {
//       return clipFill?.dark || clipFill?.light || theme.colors.background;
//     }
//     return clipFill?.light || theme.colors.background;
//   }};

const ConcaveContainer = styled(Box)<ContainerProps>`
  ${({ theme, clipPath, clipFill }) => sharedStyles(theme, clipPath, clipFill)}
  transform: ${({ clipPath }) =>
    clipPath === "#bottomConcaveCurve"
      ? "translate(0, -13px)"
      : "translate(0, 1px)"};
`;

const ConvexContainer = styled(Box)<ContainerProps>`
  ${({ theme, clipPath, clipFill }) => sharedStyles(theme, clipPath, clipFill)}
 
`;

export const ConvexTop: React.FC<React.PropsWithChildren<CurveProps>> = ({
  clipFill,
}) => (
  <ConvexContainer clipFill={"black"} clipPath="#topConvexCurve">
    
  </ConvexContainer>
);

export const ConvexBottom: React.FC<React.PropsWithChildren<CurveProps>> = ({
  clipFill,
}) => (
  <ConvexContainer clipFill={clipFill} clipPath="#bottomConvexCurve">
    
  </ConvexContainer>
);

export const ConcaveTop: React.FC<React.PropsWithChildren<CurveProps>> = ({
  clipFill,
}) => (
  <ConcaveContainer clipFill={clipFill} clipPath="#topConcaveCurve">
    
  </ConcaveContainer>
);

export const ConcaveBottom: React.FC<React.PropsWithChildren<CurveProps>> = ({
  clipFill,
}) => (
  <ConcaveContainer clipFill={clipFill} clipPath="#bottomConcaveCurve">
   
  </ConcaveContainer>
);
