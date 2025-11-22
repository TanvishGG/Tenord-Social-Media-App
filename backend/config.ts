
export const WEB_DOMAIN = "https://tenord.tanvish.co.in";
export const API_DOMAIN = "https://api.tenord.tanvish.co.in";
export const CDN_DOMAIN = "https://cdn.tenord.tanvish.co.in";
export const NAME = "Tenord";

if (!WEB_DOMAIN || !API_DOMAIN || !CDN_DOMAIN) {
  throw new Error("Please set WEB_DOMAIN, API_DOMAIN, and CDN_DOMAIN in the environment variables.");
};
