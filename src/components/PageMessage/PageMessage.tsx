import { useReducer, useEffect, useRef } from "react";
import { MdClose, MdOutlineRotateRight } from "react-icons/md";

export interface PageMessageProps {
  /** the primary message to display */
  message: string;
  /** if true, include a spinner by the message */
  isLoading?: boolean;
  /** if given, show an X to close the message and call this when that is clicked */
  onClose?: () => void;
  /** if given (with actionText) display an additionl button that will call this when clicked, for example, to retry and error */
  onAction?: () => void;
  /** the text that should be displayed on the onAction button */
  actionText?: string;
  /** if provided, render as an error message and include the error's message on a second line */
  error?: Error;
}

interface MessageInstance {
  key: number;
  redraw: () => void;
}

// global List of all current PageMessage, from any component
let ALL_MESSAGES: MessageInstance[] = [];

// current message key, simple incrementing counter
// needed for maintaining global awareness
let CURRENT_KEY = 0;

// the message box height
const HEIGHT = 60;
const VPADDING = 8;

// margin between boxes
const MARGIN = 10;
const BOTTOM_MARGIN = 30;

const incrementReducer = (x: number) => x + 1;

/** A message that appears until dismissed or until no longer desired by its parent component.
 * Is placed at the bottom of the page on top of any other content.
 * Multiple messages will stack vertically, with the oldest on the bottom and newer ones above it.
 */
export default function PageMessage({
  message,
  isLoading,
  onClose,
  onAction,
  actionText,
  error,
}: PageMessageProps) {
  const [, forceUpdate] = useReducer(incrementReducer, 0);
  const idRef = useRef<number>(0);

  // assign this instance its key and add it to the global list
  useEffect(() => {
    CURRENT_KEY += 1;
    idRef.current = CURRENT_KEY;

    ALL_MESSAGES.push({
      key: idRef.current,
      redraw: forceUpdate,
    });

    forceUpdate();

    return () => {
      // This message no longer needed, remove it from the global tracking list
      ALL_MESSAGES = ALL_MESSAGES.filter((e) => {
        if (!e) {
          return false;
        }
        return e.key !== idRef.current;
      });

      // Trigger all other instances to redraw as they might need a new position
      ALL_MESSAGES.forEach((e) => {
        if (e && typeof e.redraw === "function") {
          e.redraw();
        }
      });
    };
  }, []);

  const errorMessage = messageFromError(error);

  let position = -1;
  ALL_MESSAGES.forEach((e, i) => {
    if (e && e.key === idRef.current) {
      position = i;
    }
  });

  if (position < 0) {
    // Potentially first render before effect happens, or caused by Strict Mode double rendering
    return null;
  }
  // the 2 * VPADDING would be needed with content-box but not border-box
  const bottom = BOTTOM_MARGIN + position * HEIGHT /* + 2 * VPADDING*/ + position * MARGIN;

  const isError = typeof error !== "undefined";
  const bg = isError ? " bg-red-300" : " bg-sky-100";
  const shadowColor = isError ? " shadow-red-400" : " shadow-sky-200";

  return (
    <div
      className={
        "fixed left-1/4 z-50 flex w-1/2 items-center rounded-2xl text-lg shadow" + bg + shadowColor
      }
      style={{
        bottom: bottom,
        height: HEIGHT,
        padding: `${VPADDING}px 20px`,
      }}
    >
      {isLoading && (
        <div className="m-3 flex text-3xl">
          <MdOutlineRotateRight className="animate-spin" />
        </div>
      )}
      <div className="flex-auto overflow-hidden">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          <b>{message || "No Message Provided"}</b>
        </div>
        {errorMessage && (
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-base">
            {errorMessage}
          </div>
        )}
      </div>
      {actionText && typeof onAction === "function" && (
        <button onClick={onAction} className="mx-3 my-0 border border-black px-4 py-1 text-base">
          {actionText}
        </button>
      )}
      {typeof onClose === "function" && (
        <button
          className="align-center flex w-fit bg-inherit text-2xl text-black"
          onClick={() => {
            typeof onClose === "function" ? onClose() : null;
          }}
        >
          <MdClose />
        </button>
      )}
    </div>
  );
}

export function messageFromError(error?: Error): string | undefined {
  if (!error) {
    return undefined;
  }
  if ("code" in error) {
    if (error.code === "ERR_NETWORK") {
      if (navigator.onLine) {
        return "Probably CORS (API Config)";
      }
      return "Network Error";
    }
    return error.code as string;
  }

  return error.message;
}
