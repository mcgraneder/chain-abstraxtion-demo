
export function isProduction() {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
}

export const shortenAddress = (d: string, offset = 5) => {
  return `${d?.substring(0, offset)}...${d?.substring(
    d?.length - offset,
    d?.length
  )}`;
};