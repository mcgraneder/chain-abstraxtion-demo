
export function isProduction() {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
}
