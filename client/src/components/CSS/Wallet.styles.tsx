import styled from "styled-components"

export const BridgeModalContainer = styled.div`
  border-radius: 24px;
  max-width: 386px;
  width: 100%;
  z-index: 1;
  border: 1px solid rgb(231, 227, 235);
  margin: 30px auto 0;
  background: white;
  color: #280d5f;
  /* font-weight: 900; */
  /* padding: 20px; */
  position: relative;
  //fixed bottom-0 w-full  overflow-hidden rounded-t-3xl

  @media screen and (max-width: 550px) {
    position: fixed;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    width: 100%;
     max-width: 100%;
    margin: 0;
    bottom: 0;
  }
`;

export const Input = styled.input`
  background: #eeeaf4;
  width: 100%;
  height: 30px;
  text-align: right;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 16px;
  vertical-align: top;

  

  /* margin-top: 10px; */
`;

export const AddressInput = styled.input`
  background: #eeeaf4;
  width: 100%;
  height: 50px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 16px;
  vertical-align: top;

  /* margin-top: 10px; */
`;

export const Label = styled.label`
 
  vertical-align: top;
  height: 200px;
  width: 200px;

  /* margin-top: 10px; */
`;