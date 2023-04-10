import { useMemo } from "react";
import styled from "styled-components";
import Box from "../Box/Box";
import { BoxProps } from "../Box/types";
import Flex from "../Box/Flex";
import { FlexProps } from "../Box/types";


const Container: React.FC<React.PropsWithChildren<BoxProps>> = ({
  children,
  ...props
}) => (
  <Box px={["16px", "24px"]} mx="auto" maxWidth="1200px" {...props}>
    {children}
  </Box>
);

export type DividerFill = {
  light: string;
  dark?: string;
};

export type ClipFill = {
  light: string;
  dark?: string;
};


interface PageSectionProps extends BackgroundColorProps {
  svgFill?: string;
  dividerComponent?: React.ReactNode;
  hasCurvedDivider?: boolean;
  dividerPosition?: "top" | "bottom";
  concaveDivider?: boolean;
  containerProps?: BoxProps;
  innerProps?: BoxProps;
  clipFill?: ClipFill;
  dividerFill?: DividerFill;
}

interface BackgroundColorProps extends FlexProps {
  index: number;
  padding?: string;
}

const BackgroundColor = styled(Flex).attrs({
  className: "page-bg" as string,
})<BackgroundColorProps>`
  position: relative;
  flex-direction: column;
  align-items: center;
  z-index: ${({ index }) => index - 1};
  padding: ${({ padding }) => padding};
`;

const ChildrenWrapper = styled(Container)`
  min-height: auto;
  padding-top: 16px;
  padding-bottom: 16px;

 
`;
//  ${({ theme }) => theme.mediaQueries.sm} {
//     padding-top: 32px;
//     padding-bottom: 32px;
//   }

//   ${({ theme }) => theme.mediaQueries.lg} {
//     padding-top: 48px;
//     padding-bottom: 48px;
//   }

const PageSection: React.FC<React.PropsWithChildren<PageSectionProps>> = ({
  children,
  svgFill,
  index = 1,
  dividerComponent,
  dividerPosition = "bottom",
  hasCurvedDivider = true,
  concaveDivider = false,
  clipFill,
  dividerFill,
  containerProps,
  innerProps,
  ...props
}) => {
  const padding = useMemo(() => {
    // No curved divider
    if (!hasCurvedDivider) {
      return "48px 0";
    }
    // Bottom curved divider
    // Less bottom padding, as the divider is present there
    if (dividerPosition === "bottom") {
      return "48px 0 14px";
    }
    // Top curved divider
    // Less top padding, as the divider is present there
    if (dividerPosition === "top") {
      return "14px 0 48px";
    }
    return "48px 0";
  }, [dividerPosition, hasCurvedDivider]);

  return (
    <Box {...containerProps}>
      
      <BackgroundColor index={index} padding={padding} {...props}>
        <ChildrenWrapper {...innerProps}>{children}</ChildrenWrapper>
      </BackgroundColor>
     
    </Box>
  );
};

export default PageSection;
