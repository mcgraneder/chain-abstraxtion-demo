import styled, { css } from "styled-components"

export const Backdrop = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  opacity: 0;
  pointer-events: none;
  backdrop-filter: blur(5px);
  z-index: 1000;
  pointer-events: none;
  transition: opacity 0.15s ease-in-out !important;
  background: rgba(2, 8, 26, 0.45);
  ${(props: any) =>
    props.visible &&
    css`
      opacity: 1;
      pointer-events: all;
    `}
`;

export const FormWrapper = styled.div`
  position: fixed;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  width: 430px;
  background-color: rgb(13, 17, 28);
  text-align: right;
  padding: 30px 15px;
  padding-bottom: 20px;
  border: 1.5px solid rgb(60, 65, 80);
  border-radius: 15px;
  display: block;
  z-index: 10000000000;

  box-shadow: 14px 19px 5px 0px rgba(0, 0, 0, 0.85);
  color: white;
`;
