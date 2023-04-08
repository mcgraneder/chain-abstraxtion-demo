import React, { useEffect, useState } from "react";
import NotificationStyles from "../CSS/Notification.styles";
import styled from "styled-components";
import { UilTimes, UilCheckCircle, UilExclamationTriangle } from '@iconscout/react-unicons';

export const CloseIcon = styled(UilTimes)`
  color: White;
  z-index: 10;
  &:hover {
    cursor: pointer;
  }
`;

const {
  BarStyled,
  NotificationStyled,
} = NotificationStyles;

const Notification =({
  dispatch,
  id,
  message = "",
  title = "",
  type = "",
  position = "",
  success,
}: any) => {
  const [isClosing, setIsClosing] = useState(false);
  const [barWidth, setBarWidth] = useState(0);

  const notificationWidth = 320;

  const startTimer = React.useCallback(() => {
    if (isClosing) return;
    const idInt = setInterval(() => {
      setBarWidth((prev) => {
        if (prev < notificationWidth) return prev + 1;

        clearInterval(idInt);
        return prev;
      });
    }, 65);
  }, [isClosing]);

  const closeNotification = React.useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      // @ts-ignore
      dispatch({
        type: "remove_notification",
        id,
      });
    }, 400);
  }, [dispatch, id]);

  useEffect(() => {
    if (isClosing) return;
    if (barWidth === notificationWidth) closeNotification();
  }, [barWidth, isClosing, closeNotification]);

  useEffect(() => startTimer(), [startTimer]);

  return (
    <NotificationStyled
      id={id}
      isClosing={isClosing}
      type={type}
      position={position}
    >
      <div className="flex mt-1 justify-center">
        {success ? (
          <UilCheckCircle size="40" color={"rgb(38,162,91)"} />
        ) : (
          <UilExclamationTriangle size="40" color={"red"} />
        )}
      </div>
      <div className="ml-4 flex max-w-[250px] flex-col gap-[2px] break-words text-white">
        <div className="flex items-center justify-between">
          <span className="text-[17px] font-[800]  text-[#280d5f]">
            {title}
          </span>
          <UilTimes
            className="h-6 w-6 font-semibold text-[#280d5f] hover:cursor-pointer"
            onClick={closeNotification}
          />
        </div>
        <span className="text-[15px] font-[600] text-[#7a6eaa] leading-tight">{message}</span>
      </div>
      <BarStyled
        style={{ width: barWidth }}
        colour={success ? "rgb(168,85,247)" : "red"}
      />
    </NotificationStyled>
  );
};

export default Notification;
