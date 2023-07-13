import { ReactNode } from "react";

export type CellTextAlignment = "left" | "right" | "center";

export interface TableColumn<T> {
  /** The accessor (field name) in the data row for this column */
  accessor: string;
  /** The header for the table. Defaults to accessor if not given */
  Header?: (() => ReactNode) | ReactNode;
  /** The rendered cell content for the table. Defaults to value of row[accessor] if not given */
  Cell?: ((row: T) => ReactNode) | ReactNode;
  /** Default column width */
  width?: number;
  /** Text alignment for this column's cell content */
  align?: CellTextAlignment;
  /** If true column cannot be resized */
  fixedSize?: boolean;
  /** Formatter for the cell. A function that receives the value and returns something renderable  */
  format?: (value: unknown, row: T) => ReactNode;
  /** If true, row content for this column should always be uppercase */
  uppercase?: boolean;
  /** If true, will not render the column */
  hidden?: boolean;
  /** Fix the column to the left or the right */
  fixed?: "left" | "right";
  /** Class Name(s) to apply to the header */
  headerClass?: string;
  /** Class Name(s) to apply to the cell in the row */
  cellClass?: string | ((row: T, column: TableColumn<T>, rowIndex: number) => string | undefined);
  /** Set the row span on each tr's td */
  rowSpan?: number | ((row: T, column: TableColumn<T>) => number | undefined);
  /** column span of the header */
  colSpan?: number;
  /** If this function returns true, skip rendering the td, to accomodate a rowSpan  */
  skipTd?: (row: T, column: TableColumn<T>) => boolean | undefined;
  /** If given, adds an onClick to the td and will call this function to handle it */
  onCellClick?: (row: T, column: TableColumn<T>) => void;
  /** Location of left fixed column, set internally */
  _fixedLeft?: number;
  /** Location of right fixed column, set internally */
  _fixedRight?: number;
  /** Width after user resized it, set internally */
  _resizeWidth?: number;
}

export type ExtraHeader = TableColumn<unknown>;
export type ExtraHeaderRow = ExtraHeader[];
