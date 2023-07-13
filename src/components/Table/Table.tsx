import React, { useReducer, useMemo, CSSProperties } from "react";
import TableHeader, { DEFAULT_WIDTH } from "./TableHeader";
import { ExtraHeaderRow, TableColumn } from "./TableTypes";

type ClassFromRow<T> = string | ((row: T) => string | undefined);
export type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  extraHeadersTop?: ExtraHeaderRow[];
  footerData?: T[];
  /** Function that receives the row and returns a class that should be applied to the TR */
  getTRClass?: ClassFromRow<T>;
  /** functio ntaht receives the row and returns class that should be applied to the tr of the footer */
  getFooterClass?: ClassFromRow<T>;
  /** If true, table width is 100% */
  fullWidth?: boolean;
  /** Skip calling format function if provided */
  noFormat?: boolean;
  /** if true, no thead */
  noHeader?: boolean;
};

function cellContent<T>(row: T, column: TableColumn<T>, noFormat?: boolean): React.ReactNode {
  let value: React.ReactNode = "";
  if (typeof column.Cell === "function") {
    value = column.Cell(row);
  } else if (column.Cell) {
    value = column.Cell;
  } else if (column.accessor) {
    // value = (row as unknown as Record<string, React.ReactNode>)[column.accessor];
    value = row[column.accessor as keyof T] as React.ReactNode;
    if (typeof column.format === "function" && noFormat !== true) {
      value = column.format(value, row);
    }
  }
  if (column.uppercase && typeof value === "string") {
    value = value.toUpperCase();
  }
  return value;
}

const incrementReducer: React.ReducerWithoutAction<number> = (current: number) => current + 1;

export default function Table<T>({
  data,
  columns = [],
  extraHeadersTop = [],
  footerData = [],
  getTRClass,
  getFooterClass,
  fullWidth,
  noFormat,
  noHeader,
}: TableProps<T>) {
  const [columnResizedCount, redrawTable] = useReducer(incrementReducer, 0);

  // Calculate Fixed Column Positions
  // This is effectively a useEffect, except I need it to happen during this render (now)
  // Instead of some future render
  useMemo(() => {
    const headerRows: TableColumn<T>[][] = [columns];
    if (extraHeadersTop) {
      headerRows.push(...(extraHeadersTop as unknown as TableColumn<T>[][]));
    }
    headerRows.forEach((columns) => {
      let left = 0;
      let right = 0;
      const rightCols: number[] = [];
      columns.forEach((col, i) => {
        if (col.fixed === "left") {
          // Can build left position as we go
          col._fixedLeft = left;
          left += col._resizeWidth || col.width || DEFAULT_WIDTH;
        } else if (col.fixed === "right") {
          // Track the index of columns on the right
          rightCols.push(i);
        }
      });
      // Reverse the order of right fixed columns, so we start at right most
      rightCols.reverse();
      rightCols.forEach((colI) => {
        const col = columns[colI];
        if (col && col.fixed === "right") {
          // This condition should always be true, but checking just incase something bad happened
          col._fixedRight = right;
          right += col._resizeWidth || col.width || DEFAULT_WIDTH;
        }
      });
    });
    // columnResizedCount is an "extra" dep since not used in the memo,
    // But since memo is acting like an effect, I need it to trigger when it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, columnResizedCount, extraHeadersTop]);

  return (
    <table
      style={{
        width: fullWidth ? "100%" : 400,
        tableLayout: "fixed",
        position: "relative",
        userSelect: "text",
        borderCollapse: "separate",
        borderSpacing: 0,
        textAlign: "left",
      }}
    >
      {!noHeader && (
        <thead style={{ position: "sticky", top: 0, zIndex: 5 }}>
          {extraHeadersTop.map((tr, i) => (
            <tr key={i}>
              {tr.map((th, j) => {
                if (th.hidden) {
                  return null;
                }
                return (
                  <TableHeader
                    key={th.accessor || j}
                    column={th}
                    onResizeFinished={redrawTable}
                    // noResize={extraHeadersTop.length > 0 ? true : undefined}
                  />
                );
              })}
            </tr>
          ))}
          <tr>
            {columns.map((column) => {
              if (column.hidden) {
                return null;
              }
              return (
                <TableHeader
                  key={column.accessor}
                  column={column}
                  onResizeFinished={redrawTable}
                  noResize={extraHeadersTop.length > 0 ? true : undefined}
                />
              );
            })}
          </tr>
        </thead>
      )}
      <tbody>{renderRows(data, columns, getTRClass, noFormat)}</tbody>
      {footerData.length > 0 && (
        <tfoot style={{ position: "sticky", bottom: 0, zIndex: 5 }}>
          {renderRows(footerData, columns, getFooterClass, noFormat, true)}
        </tfoot>
      )}
    </table>
  );
}

/** render the rows (tr) of data
 * @returns array of tr nodes
 */
function renderRows<T>(
  rows: T[],
  columns: TableColumn<T>[],
  getTRClass?: ClassFromRow<T>,
  noFormat?: boolean,
  isFooter?: boolean,
) {
  return rows.map((row, i) => {
    if (!row) {
      return null;
    }

    // determine the class name for the tr
    let rowClass: string | undefined = undefined;
    if (typeof getTRClass === "function") {
      const addedTrClass = getTRClass(row);
      if (addedTrClass) {
        rowClass = addedTrClass;
      }
    } else if (typeof getTRClass === "string") {
      rowClass = getTRClass;
    }

    return (
      <tr key={i} className={rowClass}>
        {columns.map((column) => {
          if (column.hidden) {
            return null;
          }
          if (typeof column.skipTd === "function") {
            if (column.skipTd(row, column) === true) {
              return null;
            }
          }

          // add style attributes
          const style: CSSProperties = {
            left: column.fixed === "left" ? column._fixedLeft : undefined,
            right: column.fixed === "right" ? column._fixedRight : undefined,
            overflow: "hidden",
            textOverflow: "ellipsis",
          };
          if (column.align) {
            style.textAlign = column.align;
          }
          if (column.fixed) {
            style.position = "sticky";
            style.zIndex = isFooter ? 5 : 2;
            style.boxSizing = "border-box";
          }

          // determine class name for the td
          let className: string | undefined = undefined;
          if (column.cellClass) {
            if (typeof column.cellClass === "function") {
              const addedClass = column.cellClass(row, column, i);
              if (addedClass) {
                className = addedClass;
              }
            } else {
              className = column.cellClass;
            }
          }

          // determine row span
          let rowSpan = undefined;
          if (column.rowSpan) {
            if (typeof column.rowSpan === "function") {
              rowSpan = column.rowSpan(row, column);
            } else {
              rowSpan = column.rowSpan;
            }
          }

          // create click handler
          let onClick: (() => void) | undefined = undefined;
          if (typeof column.onCellClick === "function") {
            onClick = () => {
              if (column.onCellClick) {
                column.onCellClick(row, column);
              }
            };
          }

          return (
            <td
              key={column.accessor}
              rowSpan={rowSpan}
              style={style}
              className={className}
              onClick={onClick}
              onKeyDown={
                onClick
                  ? (ev) => {
                      if (ev.key === "Enter" || ev.key === " ") {
                        if (onClick) {
                          onClick();
                        }
                      }
                    }
                  : undefined
              }
              role={onClick ? "button" : undefined}
              tabIndex={onClick ? 0 : undefined}
            >
              {cellContent(row, column, noFormat)}
            </td>
          );
        })}
      </tr>
    );
  });
}
