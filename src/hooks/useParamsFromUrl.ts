import { useMemo } from "react";

export interface UrlParamState {
  [key: string]: string | undefined;
}

/** guesses the params from a url
 * @param paramNames slash (/) separated list of params in order on the url
 *
 * @example
 * // window.location.pathname = /pages/test/inner/foo/bar
 * useParamsFromUrl("page/first/second");
 * // { page: "pages", first: "test", second: "inner", foo: "bar" }
 */
export default function useParamsFromUrl(pathParams = ""): UrlParamState {
  const pathname = window.location.pathname;
  const paramMap = useMemo(() => {
    const paramMap: UrlParamState = {};
    try {
      if (pathname) {
        let prev: string | undefined = undefined;
        const paramNames = pathParams.at(0) === "/" ? pathParams : "/" + pathParams;
        const pathParts = pathname.split("/");
        const paramParts = paramNames.split("/");
        pathParts.forEach((part, i) => {
          if (!part) {
            // skip empty parts
            // since path starts with /, first part will always be empty
            return;
          }
          const decodedPart = decodeURIComponent(part);
          if (paramParts[i]) {
            paramMap[paramParts[i]] = decodedPart;
          } else if (prev === undefined) {
            prev = decodedPart;
          } else {
            paramMap[prev] = decodedPart;
            prev = undefined;
          }
        });
      }
    } catch (e) {
      console.error("error guessing params from url", e);
    }
    return paramMap;
  }, [pathname, pathParams]);

  return paramMap;
}
