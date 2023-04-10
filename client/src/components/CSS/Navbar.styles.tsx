import styled, { css } from 'styled-components';
import tailwindConfig  from ".././../../tailwind.config";

//create colours instead of hardcoding
const colours = tailwindConfig.theme.extend.colors

type GenericWrapper = {
  isNavbarDark?: boolean;
};

type GenericBoxItemContainer = {
    allignment?: "flex-start" | "flex-end"
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const Wrapper = styled.div<GenericWrapper>`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: space-between;
  position: fixed;
  top: 0px;
  z-index: 10;
  /* background: rgb(12, 18, 43); */
  background: White;
  border-bottom: 1px solid rgb(231, 227, 235);
`;

export const Nav = styled.nav`
  padding: 10px 12px;
  width: 100%;
  height: 60px;
  z-index: 2;
  box-sizing: border-box;
  display: block;
`;

export const Box = styled.div`
  box-sizing: border-box;
  vertical-align: initial;
  -webkit-tap-highlight-color: transparent;
  display: flex;
  flex-wrap: nowrap;
  height: 100%;
`;


export const BoxItemContainer = styled.div`
  box-sizing: border-box;
  vertical-align: initial;
  -webkit-tap-highlight-color: transparent;
  justify-content: ${(props: any) => props.allignment};
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  width: 100%;
  align-items: center;
`;

export const StyledTokenRow = styled.div<{
  first?: boolean;
  last?: boolean;
  loading?: boolean;
}>`
  background-color: transparent;
  display: grid;
  grid-template-columns: 2fr 4fr 2fr 2fr;
  padding: 16px;
  width: 100%;
`;
