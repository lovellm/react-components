Very generic table component. Renders an html table element.
Input data is an array of objects.
Column definitions determine header and what should be displayed on the rows.

By default

- There is no styling applied
- Header rows are "fixed" to the top and don't scroll
- Footer rows are "fixed" to the bottom and don't scroll

Options that are available

- Fix any number of columns to left or right
- Resize columns
- Extra header rows with colspans to group column (resizing doesn't work well with extra headers)
- Dynamic Rowspan based on the data
- On click events for any cell
- Dynamic formatting for both rows (tr) and cells (td) based on the data
- Value formatting for data within the cells
- Complex rendering of cell data, such as an in-line bar chart
