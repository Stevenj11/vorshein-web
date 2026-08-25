import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // command-center is an unlocalized admin area — excluded from next-intl's
  // locale-prefix redirect, same as api/_next/_vercel/static files.
  matcher: ["/((?!api|_next|_vercel|command-center|.*\\..*).*)"],
};
