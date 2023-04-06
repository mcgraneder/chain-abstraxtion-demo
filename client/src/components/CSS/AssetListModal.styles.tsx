import styled from "styled-components"

export const TokenInputContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 0px;
  padding-top: 10px;
  padding-bottom: 10px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: start;
  justify-content: flex-start;
  box-sizing: border-box;
  margin: 0px;
  min-width: 0px;
`;

export const TokenInput = styled.input`
  position: relative;
  display: flex;
  padding: 8px 25px;
  -webkit-box-align: center;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: transparent; //rgb(17, 25, 42);
  outline: none;
  border-radius: 12px;
  color: rgb(255, 255, 255);
  border: 1px solid rgb(64, 68, 79);
  appearance: none;
  font-size: 18px;
  transition: border 100ms ease 0s;

  &:focus {
    border: 1px solid rgb(89, 115, 254);
  }
`;

export const Input = styled.input`
  background: #eeeaf4;
  width: 100%;
  height: 30px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 16px;
  vertical-align: top;
  color: rgb(118, 69, 217);
  font-weight: 700;

  /* margin-top: 10px; */
`;
