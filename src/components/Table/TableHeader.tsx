import React, { useState, useRef, useCallback, CSSProperties } from "react";
import { ExtraHeader, TableColumn } from "./TableTypes";

export type TableHeaderProps<T> = {
  /** The TableColumn this header represents. Must be reference stable or strange stuff will happen. */
  column: TableColumn<T> | ExtraHeader;
  /** Callback after a resize happens. Must be reference stable or strange stuff will happen. */
  onResizeFinished?: () => void;
  onClick?: (accessor: string) => void;
  /** if true, ignore resize */
  noResize?: boolean;
};

interface DragInfo {
  currentWidth: number;
  lastX: number;
  startX?: number;
  startWidth?: number;
}

export const DEFAULT_WIDTH = 130;
const MIN_COLUMN_WIDTH = 30;

export default function TableHeader<T>({
  column,
  onResizeFinished,
  onClick,
  noResize,
}: TableHeaderProps<T>) {
  const [columnWidth, setColumnWidth] = useState(
    column._resizeWidth || column.width || DEFAULT_WIDTH,
  );
  // false if never dragged, true while dragging, Date of drag end after drag
  const [isDragging, setIsDragging] = useState<boolean | Date>(false);
  const dragRef = useRef({});
  const dragInfo = dragRef.current as DragInfo;
  dragInfo.currentWidth = columnWidth;

  /** Prevents scrolling on touch move when resizing a column */
  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
  }, []);

  /** Handles a pointer move to drag a handle */
  const handleDrag = useCallback(
    (e: PointerEvent) => {
      // Prevent Default to stop text highlighting
      e.preventDefault();
      e.stopPropagation();

      const move = e.clientX - dragInfo.lastX; // Movement relative to prior x
      // const move = e.clientX - dragInfo.startX; // Movement relative to starting x
      dragInfo.lastX = e.clientX;
      const newWidth = dragInfo.currentWidth + move;
      if (newWidth <= MIN_COLUMN_WIDTH) {
        setColumnWidth(MIN_COLUMN_WIDTH);
      } else {
        setColumnWidth(newWidth);
      }
      column._resizeWidth = newWidth;
    },
    [dragInfo, column],
  );

  /** Handles a pointer up to end a drag */
  const handleDragEnd = useCallback(() => {
    // Track when the drag end to avoid conflicting with onClick events
    setIsDragging(new Date());
    window.document.removeEventListener("touchmove", handleTouchMove);
    window.document.removeEventListener("pointerup", handleDragEnd);
    window.document.removeEventListener("pointermove", handleDrag);
    if (typeof onResizeFinished === "function") {
      onResizeFinished();
    }
  }, [handleDrag, handleTouchMove, onResizeFinished]);

  /** Handles a pointer down to initiate a potential drag event */
  const handleDragStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      // Ignore clicks other than left click
      if (typeof e.button === "number" && e.button !== 0) {
        return;
      }
      e.preventDefault();
      dragInfo.startX = e.clientX;
      dragInfo.lastX = e.clientX;
      dragInfo.startWidth = dragInfo.currentWidth;
      setIsDragging(true);
      window.document.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.document.addEventListener("pointerup", handleDragEnd);
      window.document.addEventListener("pointermove", handleDrag);
    },
    [dragInfo, handleDragEnd, handleDrag, handleTouchMove],
  );

  // add style attributes
  const style: CSSProperties = {
    position: "relative",
    width: columnWidth + "px",
    minWidth: MIN_COLUMN_WIDTH,
    maxWidth: columnWidth + "px",
    left: column.fixed === "left" ? column._fixedLeft : undefined,
    right: column.fixed === "right" ? column._fixedRight : undefined,
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
  if (column.fixed) {
    style.position = "sticky";
    style.zIndex = 5;
    style.boxSizing = "border-box";
  }
  if (column.align) {
    style.textAlign = column.align;
  }

  let className: string | undefined = undefined;
  if (column.headerClass) {
    className = column.headerClass;
  }

  let headerValue: React.ReactNode = column.accessor;
  if (typeof column.Header === "function") {
    headerValue = column.Header();
  } else if ("Header" in column) {
    headerValue = column.Header;
  }

  return (
    <th
      style={style}
      colSpan={column.colSpan && column.colSpan > 0 ? column.colSpan : undefined}
      className={className}
      onClick={() => {
        let shouldClick = true;
        // Dragging is a date means we ended a drag on this column.
        // If is was <200ms ago, don't click, as it may be due to pointer up being over header instead of resize handle
        if (isDragging instanceof Date) {
          if (new Date().valueOf() - isDragging.valueOf() < 200) {
            shouldClick = false;
          }
        }
        if (shouldClick && column.accessor && typeof onClick === "function") {
          onClick(column.accessor);
        }
      }}
    >
      <div>{headerValue}</div>
      {!noResize && !column.fixedSize && (
        <div
          style={{
            position: "absolute",
            cursor: "col-resize",
            width: "7px",
            right: 0,
            top: 0,
            zIndex: 5,
            height: "100%",
            backgroundColor: isDragging === true ? "rgb(150, 170, 190)" : undefined,
          }}
          onPointerDown={handleDragStart}
        />
      )}
    </th>
  );
}

/** sums up the column widths for the given columns.
 * useful if making an extra header that should span several columns.
 */
export const sumColumnWidths = <T,>(columns: TableColumn<T>[]): number => {
  if (!columns || !columns.length) {
    return 0;
  }
  return columns.reduce((prev, col) => {
    return prev + (col.width || 0);
  }, 0);
};
