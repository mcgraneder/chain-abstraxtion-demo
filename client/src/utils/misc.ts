
export function isProduction() {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
}

export const shortenAddress = (d: string, offset = 4) => {
  return `${d?.substring(0, 2)}...${d?.substring(
    d?.length - offset,
    d?.length
  )}`;
};