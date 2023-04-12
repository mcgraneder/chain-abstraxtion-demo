import jazzicon from "@metamask/jazzicon";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

const StyledIdenticon = styled.div<{ iconSize: number }>`
  height: ${({ iconSize }: any) => `${iconSize}px`};
  width: ${({ iconSize }: any) => `${iconSize}px`};
  border-radius: 50%;
  background-color: ${({ theme }: any) => theme.deprecated_bg4};
  font-size: initial;
`;

const StyledAvatar = styled.img`
  height: inherit;
  width: inherit;
  border-radius: inherit;
`;

export default function Identicon({ size }: { size?: number }) {
  const { account } = useWeb3React();
  const [fetchable, setFetchable] = useState(true);
  const iconSize = size ?? 24;

  const icon = useMemo(
    () => account && jazzicon(iconSize, parseInt(account.slice(2, 10), 16)),
    [account, iconSize]
  );
  const iconRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const current = iconRef.current;
    if (icon) {
      current?.appendChild(icon);
      return () => {
        try {
          current?.removeChild(icon);
        } catch (e) {
          console.error("Avatar icon not found");
        }
      };
    }
    return;
  }, [icon, iconRef]);

  const handleError = useCallback(() => setFetchable(false), []);

  return (
    <StyledIdenticon iconSize={iconSize}>
      <span ref={iconRef} />
    </StyledIdenticon>
  );
}
