import { useState, useCallback, useEffect } from "react";

interface PreventCopyProps {
  /** Only block things within something of this classname. If not given, assumes everything should be prevented */
  className?: string;
  /** If it would be blocked but is in something with this classname, allow it */
  allow?: string;
}

export default function PreventCopy({ className, allow }: PreventCopyProps) {
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const copyListener = useCallback(
    (e: ClipboardEvent) => {
      // By default, block all copy if no classname given
      let shouldBlock = !className;
      if (className) {
        // If className was given, only block things within that class
        try {
          const path = e.composedPath();
          let allowOverride = false;
          path.forEach((part) => {
            // Recast as Element. Theoretically possible for it to be something else (hence try block), but not sure how
            const asElement = part as Element;
            if (asElement.className) {
              // If the class name contains the given value, it should be blocked, otherwise allow
              if (asElement.className.indexOf(className) > -1) {
                shouldBlock = true;
              }
              if (allow && asElement.className.indexOf(allow) > -1) {
                allowOverride = true;
              }
            }
          });
          if (allowOverride) {
            shouldBlock = false;
          }
        } catch (pathError) {
          console.error("Error inspecting copy path", pathError);
        }
      }
      // If should block, clear the copied data and show a message
      if (shouldBlock) {
        try {
          if (e.clipboardData) {
            e.clipboardData.setData("text/plain", "");
            e.preventDefault();
            setShowMessage(true);
          }
        } catch (error) {
          console.error("Error handling copy event", error);
        }
      }
    },
    [className, allow],
  );

  // Attach / Detach Listener
  useEffect(() => {
    const listener = copyListener;
    document.addEventListener("copy", listener);
    return () => document.removeEventListener("copy", listener);
  }, [copyListener]);

  if (!showMessage) {
    return null;
  }
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/60">
      <div className="-mt-[20%] w-4/5 bg-white px-12 py-8 text-2xl shadow-xl shadow-slate-600">
        <div>Copying data out of this application is not allowed.</div>
        <button
          className="mt-4 rounded-lg bg-green-400 px-8 py-4"
          onClick={() => setShowMessage(false)}
        >
          OK
        </button>
      </div>
    </div>
  );
}
