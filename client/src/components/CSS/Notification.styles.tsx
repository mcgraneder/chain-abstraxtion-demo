import styled, { keyframes } from "styled-components";

const opneRight = keyframes` 
    0% {
        right: -150%;
    }
    100% {
        right: 0%;
    }
`;
const openLeft = keyframes` 
    0% {
        right: 0%;
    }
    100% {
        right: -150%;
    }
`;

const NotificationContainerStyled = styled.div`
  position: fixed;
  z-index: 10000000000;
  right: 0;
  top: 75px;
`;

const BarStyled = styled.div`
  background-color: ${(props: any) => props.colour};
  bottom: 0;
  height: 5px;
  left: 0;
  position: absolute;
  width: 280px;
`;

const NotificationStyled = styled.div`
  animation-fill-mode: forwards;
  background-color: white;
  border-radius: 15px;
  border: 1px solid rgb(231, 227, 235);
  box-shadow: 0px 4px 10px rgba(48, 71, 105, 0.1);
  display: flex;
  margin: 15px;
  padding: 15px;
  position: relative;
  overflow: hidden;
  z-index: 9999;

  animation: ${(props: any) => (!props.isClosing ? opneRight : openLeft)} 0.65s;
`;

const NotificationStyles = {
  NotificationStyled,
  NotificationContainerStyled,
  BarStyled,
};

export default NotificationStyles;
