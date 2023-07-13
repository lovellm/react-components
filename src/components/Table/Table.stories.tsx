import { Meta, StoryObj } from "@storybook/react";
import Table from "./Table";
import { ExtraHeader, TableColumn } from "./TableTypes";
import { sumColumnWidths } from "./TableHeader";

const meta: Meta<typeof Table> = {
  component: Table,
  title: "Table",
  argTypes: {},
};
export default meta;

interface TestTableData {
  col1?: string;
  col2?: string;
  col3?: number;
  col4?: number;
  col5?: number;
  col6?: number;
  col7?: string;
  col8?: string;
  col9?: string;
  isFooter?: boolean;
}
const testTableData: TestTableData[] = [
  {
    col1: "A",
    col2: "Blue",
    col3: 3,
    col4: 4,
    col5: 5,
    col6: 6,
    col7: "Tree",
    col8: "Car",
    col9: "Up",
  },
  {
    col1: "B",
    col2: "Green",
    col3: 1.2345,
    col4: 3.25,
    col5: 5.62,
    col6: 7.2817,
    col7: "Bird",
    col8: "Truck",
    col9: "Up",
  },
  {
    col1: "C",
    col2: "Red",
    col3: undefined,
    col4: 1.13,
    col5: undefined,
    col6: 10.999,
    col7: undefined,
    col8: "Bus",
    col9: "Down",
  },
  {
    col1: "D",
    col2: "Yellow",
    col3: 10,
    col4: 20,
    col5: 30,
    col6: 40,
    col7: "Rock",
    col8: "Elevator",
    col9: "Left",
  },
  {
    col1: "E",
    col2: "Teal",
    col3: 245.4,
    col4: 422,
    col5: 4,
    col6: 948,
    col7: "Flower",
    col8: "Airplane",
    col9: "Left",
  },
  {
    col1: "F",
    col2: "Orange",
    col3: 140,
    col4: 452,
    col5: 818.3,
    col6: 249,
    col7: "Pond",
    col8: "Bicycle",
    col9: "Right",
  },
  {
    col1: "G",
    col2: "Purple",
    col3: 469,
    col4: 5397,
    col5: 9082,
    col6: 40,
    col7: "Dog",
    col8: "Chair",
    col9: "Down",
  },
  {
    col1: "H",
    col2: "Violet",
    col3: 124900,
    col4: 23791,
    col5: 3242,
    col6: 40.27,
    col7: "Cat",
    col8: "Rocket",
    col9: "Up",
  },
];
const footerData: TestTableData[] = [
  {
    col1: "Z",
    col2: "Black",
    col3: 99.99,
    col4: 100,
    col5: 200,
    col6: 57.6,
    col7: "Life",
    col8: "Thing",
    col9: "Center",
    isFooter: true,
  },
];
const altRowColorClass = (row: TestTableData, col: TableColumn<TestTableData>, i: number) => {
  const base = "border border-stone-500 px-2";
  if (row.isFooter) {
    return base + " bg-neutral-700 text-stone-50 font-bold";
  }
  if (i % 2 === 0) {
    return base + " bg-white";
  }
  return base + " bg-teal-50";
};
const allColumns: TableColumn<TestTableData>[] = [
  {
    accessor: "col1",
    Header: "Letter",
    align: "left",
    width: 100,
    headerClass: "border border-stone-500 bg-slate-100 px-2",
    cellClass: altRowColorClass,
  },
  {
    accessor: "col2",
    Header: "Color",
    align: "left",
    width: 120,
    headerClass: "border border-stone-500 bg-slate-100 px-2",
    cellClass: altRowColorClass,
  },
  {
    accessor: "col3",
    Header: "A Number",
    align: "right",
    width: 100,
    headerClass: "border border-stone-500 bg-slate-100 px-2",
    cellClass: altRowColorClass,
  },
  {
    accessor: "col4",
    Header: "Another Number",
    align: "right",
    width: 180,
    headerClass: "border border-stone-500 bg-slate-100 px-2",
    cellClass: altRowColorClass,
  },
  {
    accessor: "col5",
    Header: "Number 3",
    align: "right",
    width: 100,
    headerClass: "border border-stone-500 bg-slate-100 px-2",
    cellClass: altRowColorClass,
  },
  {
    accessor: "col6",
    Header: "More Number",
    align: "right",
    width: 120,
    headerClass: "border border-stone-500 bg-slate-100 px-2",
    cellClass: altRowColorClass,
  },
  {
    accessor: "col7",
    Header: "Thing",
    align: "center",
    width: 180,
    headerClass: "border border-stone-500 bg-slate-100 px-2",
    cellClass: altRowColorClass,
  },
  {
    accessor: "col8",
    Header: "Ride",
    align: "left",
    width: 160,
    headerClass: "border border-stone-500 bg-slate-100 px-2",
    cellClass: altRowColorClass,
  },
  {
    accessor: "col9",
    Header: "Direction",
    align: "center",
    width: 180,
    headerClass: "border border-stone-500 bg-slate-100 px-2",
    cellClass: altRowColorClass,
  },
];
const simpleColumns = [...allColumns.slice(0, 5), ...allColumns.slice(-2)];
const extraHeadersColSpan: ExtraHeader[] = [
  {
    accessor: "a",
    Header: "Texts",
    align: "center",
    colSpan: 2,
    headerClass: "border border-stone-500 bg-slate-600 text-slate-50",
    width: sumColumnWidths(allColumns.slice(0, 2)),
  },
  {
    accessor: "b",
    Header: "Numbers",
    align: "center",
    colSpan: 4,
    headerClass: "border border-stone-500 bg-rose-700 text-stone-200",
    width: sumColumnWidths(allColumns.slice(2, 6)),
  },
  {
    accessor: "c",
    Header: "More Texts",
    align: "center",
    colSpan: 3,
    headerClass: "border border-stone-500 bg-slate-600 text-slate-50",
    width: sumColumnWidths(allColumns.slice(6)),
  },
];
const extraHeaders = [extraHeadersColSpan];
const fixedColumns = [...allColumns];
fixedColumns[0].fixed = "left";
fixedColumns[1].fixed = "left";
fixedColumns[8].fixed = "right";

type Story = StoryObj<typeof Table<TestTableData>>;

export const BasicTable: Story = {
  args: {
    data: testTableData,
    columns: simpleColumns,
  },
};

export const ExtraHeaderAndFooter: Story = {
  args: {
    data: testTableData,
    columns: allColumns,
    footerData: footerData,
    extraHeadersTop: extraHeaders,
    fullWidth: true,
  },
  render: (args) => (
    <div style={{ position: "relative", width: "100%" }}>
      <Table {...args} />
    </div>
  ),
};

export const FixedColumnsScrolling: Story = {
  args: {
    data: testTableData,
    columns: allColumns,
    footerData: footerData,
    fullWidth: true,
  },
  render: (args) => (
    <div style={{ overflow: "auto", width: "700px", height: "250px" }}>
      <Table {...args} />
    </div>
  ),
};
