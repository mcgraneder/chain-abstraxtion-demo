import styled from "styled-components";
import Text from "./Text";
import { tags, scales, HeadingProps } from "./types";

const style = {
  [scales.MD]: {
    fontSize: "20px",
    fontSizeLg: "20px",
  },
  [scales.LG]: {
    fontSize: "24px",
    fontSizeLg: "24px",
  },
  [scales.XL]: {
    fontSize: "32px",
    fontSizeLg: "40px",
  },
  [scales.XXL]: {
    fontSize: "60px",
    fontSizeLg: "64px",
  },
};

const Heading = styled(Text).attrs({ bold: true })<HeadingProps>`
  font-size: ${({ scale }) => style[scale].fontSize};
  font-weight: 900;
  line-height: 1.1;
  color: ${(props) => props.color};

 
`;

export const Heading2 = styled(Text).attrs({ bold: true })<HeadingProps>`
  font-size: ${({ scale }) => style[scale].fontSize};
  font-weight: 700;
  line-height: 1.1;

 
`;

Heading.defaultProps = {
  as: tags.H2,
};

export default Heading;
