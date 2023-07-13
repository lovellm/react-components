/**
 * @jest-environment jsdom
 */
import { renderHook } from "@testing-library/react";
import useParamsFromUrl from "./useParamsFromUrl";

test("extract params from a current location", () => {
  Object.defineProperty(window, "location", {
    get() {
      return { pathname: "/testing/test1/test2/test3/test4" };
    },
  });
  const { result } = renderHook(() => useParamsFromUrl("one/two/three"));
  expect(result.current?.one).toBe("testing");
  expect(result.current?.two).toBe("test1");
  expect(result.current?.three).toBe("test2");
  expect(result.current?.test3).toBe("test4");
});
