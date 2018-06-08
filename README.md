# react-nf-table

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo
[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package
[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Guide](#guide)
  - [Basics](#basics)
- [Components](#components)
- [`<Table>`](#table)
  - [Component State](#component-state)
  - [Component Actions](#component-actions)
  - [Computed Props](#computed-props)
  - [`<TableHeaderRow>`](#tableheaderrow)
  - [`<HeaderData>`](#headerdata)
    - [`<TableHeader>`](#tableheader)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Guide

### Basics

Imagine you want to build a table from an array of objects like:

```js
[
  {
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number
  },
  ...
]
```

The table may look like

```js
import React from 'react'
import { Table, TableHeaderRow, TableHeader } from 'react-nf-table'

const data = [
  {
    name: 'Frozen yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4
  },
  // ...
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 4.9
  }
]

const MyUserTable = () => {
  return (
    <Table
      data={data}
      render={({ rows }) => {
        return (
          <table>
            <thead>
              <tr>
                <TableHeaderRow>
                  <TableHeader accessor="name">
                    <th>Name</th>
                  </TableHeader>
                  <TableHeader accessor="calories">
                    <th>Calories</th>
                  </TableHeader>
                  <TableHeader accessor="fat">
                    <th>Fat</th>
                  </TableHeader>
                  <TableHeader accessor="carbs">
                    <th>Carbs</th>
                  </TableHeader>
                  <TableHeader accessor="protein">
                    <th>Protein</th>
                  </TableHeader>
                </TableHeaderRow>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ rowKey, rowData }) => {
                return (
                  <tr key={rowKey}>
                    {rowData.map(({ accessor, data, key }) => {
                      return <td key={key}>{data}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )
      }}
    />
  )
}

export default MyUserTable
```

The `Table` component takes a `data` prop to initialize the table. The `TableHeaderRow` component will loop through the `TableHeader` children and gather the props which will be used to generate the table columns (`accessor`, `sortable`, `filterable`). The `TableHeaderRow` will fire a function that sets the columns in the parent `Table`. Once the column values in the parent change, the rows data will be computed with this column data. The children in the `TableHeader` component will be rendered as the labels for the table header.

After the row data is computed, a two-dimensional array is returned, an array of rows, with each row consisting of an array of columns.

The rows data signature is:

```js
[
  {
    rowKey: string, // dynamically generated UUID
    rowData: [
      {
        key: string, //dynamically generated UUID
        accessor: string, // accessor defined in column header
        type: string, // data-row or empty-row
        data: any // value of row at accessor
      }
    ]
    selected: boolean // is the row selected
  }
]
```

The table generated would look like:

<table>
  <thead>
    <tr>
      <th>"TableHeader Component"</th>
      <th>"TableHeader Component"</th>
      <th>"TableHeader Component"</th>
      <th>"TableHeader Component"</th>
      <th>"TableHeader Component"</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Row 1 - Column 1</td>
      <td>Row 1 - Column 2</td>
      <td>Row 1 - Column 3</td>
      <td>Row 1 - Column 4</td>
      <td>Row 1 - Column 5</td>
    </tr>
    <tr>
      <td>Row 2 - Column 1</td>
      <td>Row 2 - Column 2</td>
      <td>Row 2 - Column 3</td>
      <td>Row 2 - Column 4</td>
      <td>Row 2 - Column 5</td>
    </tr>
    <tr><td colspan="5">...</td></tr>
    <tr>
      <td>Row x - Column 1</td>
      <td>Row x - Column 2</td>
      <td>Row x - Column 3</td>
      <td>Row x - Column 4</td>
      <td>Row x - Column 5</td>
    </tr>
  </tbody>
</table>

## Components

## `<Table>`

`<Table>` is a component that helps you build tables. It uses render props which take props that act as inputs, and generates table data based on the prop inputs and the current state of the table. To handle situations such as table pagination, sorting, filtering, helper functions are passed as part of the render props.

### Component State

All component state can be updated with a corresponding prop with the same name. In most cases, the only values you need to change are `data`, `pageSize`, `pageSizeOptions`.

columns: Array of column values that should be set using `setHeaderData` at runtime unless using serverside rendering, then it would be required to set as a prop. Takes the format:

```
[
  {
    accessor: string or falsy,
    // any other value that may be useful for computed column information
    // examples
    // label: any,
    // sortable: boolean,
    // filterable: boolean
  }
]
```

- `accessor`: Maps the column to the property in the data object

data: Initial data to populate the table. Assumes data is an array of objects. When the component is initialized, each object in the array has a new property added called `_table_id` which acts as a unique id that is used for the `rowKey`.

total: The total number of objects in the table.

pageSize: The current pageSize to compute the number of rows. (default: 8)

currentPage: The current page to compute the rows. (default: 1)

selectedPage: The selected page value to control an external page size changing input box. This value can be used to make an input box a controlled input by the table component. It is **NOT** used to compute any row data. The `currentPage` value is used to compute the row data.

pageSizeOptions: An array of numbers used to control which pageSize options are allowed in the table. (default: [8, 16, 24, 48])

sorting: An array of values used for sorting the rows with format:

```
[
  {
    id: string,
    asc: boolean
  }
]
```

filtering: An array of values used for filtering the rows with format:

```
[
  {
    id: string,
    value: string
  }
]
```

selecting: An array of strings used for selecting rows in a table. The values are either a `rowKey` or the string `'all'` to represent all rows are selected.

### Component Actions

setHeaderData: Takes an object with columns and sets it to the state of the table as `columns`. The column must be an array.

handleSort: Takes two arguments, a column accessor value (`columnAccessor`) and an optional parameter `multipleSelect` when sorting is multiple select.

- If NOT multiple selection, the column is either saved into state under the `sorting` field with the `id` as the column accessor and `asc` value as true.

- If the value is already in the sorting array, then the `asc` value in the object is toggled.

- If mutiple selection is true and the value is NOT in the array currently, it will add the default object with id as the column accessor and `asc` value as true.

- If multiple selection is true and the value is in the array currently, it will move the selected column to the end of the array and toggle the `asc` value.

handleFilter: Takes a column accessor argument and a value argument and saves the filtered value in the `filtering` array in the table state.

- If the accessor is currently not a filtered value, it will add an object with the id as the column accessor and the value into the array.
- If the accessor is already in the array, it will move that value to the end of the array.

handleNextPage: Takes an optional event input. If the event is passed, `preventDefault` will be called. The state of the table will update based on the computed paginated value. It will update the the `currentPage` and the `selectedPage` if there is a next page available.

handlePrevPage: Takes an optional event input. If the event is passed, `preventDefault` will be called. The state of the table will update based on the computed paginated value. It will update the the `currentPage` and the `selectedPage` if there is a prev page available.

handlePageChange: Helper function to handle the temporary state of a page change when the input box is controlled by the table component. Takes an event as an argument. `preventDefault` is executed and `selectedPage` is set from the `e.target.value` of the event. The `currentPage` state will not be effected, so the table will never update the table rows. See `handlePageChangeBlur` to update `currentPage`

handlePageChangeBlur: Handles page change events on input blur. Takes an event argument and executes `preventDefault`. The value is pulled from `e.target.value` and is valided based on the current data. If the value is valid, then `selectedPage` and `currentPage` are both updates to this value. If the value is **invalid**, then the state values `selectedPage` and `currentPage` are reset to the original `currentPage` value.

handlePageSizeChange: Takes an event as an argument and calls `preventDefault` and retrieves the page size in the event from `e.target.value`. The state is updated with the new page size under `pageSize` and `currentPage`, `selecting`, `sorting`, and `filtering` are all reset to their original values.

handleRowSelect: Takes a `rowKey` as an argument. The `rowKey` is a unique id returned in the `rows` array **OR** the value `'all'` to represent when all rows in the table are selected.

- If a `rowKey` is passed and is currently in the `selecting` array, then it is removed from the array

- If a `rowKey` is passed and is **NOT** currently in the `selecting` array, then it is added to the array.

- If `'all'` is passed and `selecting` is **NOT** currently `'all'`, then `selecting` array will be reset to only include `'all'`, regardless if any `rowKeys` are present in the `selecting` array.

- If `'all'` is passed and `selecting` is set to `'all'`, then selecting is reset to an empty array.

setTableState _(advanced)_: Generic function to wrap the table `setState`. Any value can be set or overwritten in the parent state. Should be used with **CAUTION**

### Computed Props

rows: The table rows. A two dimensional array with format:

```js
;[
  {
    rowKey: string,
    selected: boolean,
    rowData: [
      {
        key: string,
        accessor: string,
        type: string,
        data: any
      }
    ]
  }
]
```

- `rowKey`: A runtime dynamicly generated UUID
- `selected`: Boolean to tell if a row is selected or not
- `rowData`: Array of row column values
  - `key`: Dynamically generated key for each row column
  - `accessor`: The accessor that maps to this data
  - `type`: The type of column, either `'data-row'` or `'empty-row'`
  - `data`: The row column value

totalNumberOfPages: Total number of pages based on the page size

hasPrevPage: true/false, true if table has a prev page

hasNextPage: true/false, true if table has a next page

### `<TableHeaderRow>`

A component to wrap all `<TableHeader>` components to read all `accessor` data at once. The data reads `setHeaderData` from context and passes it to `<HeaderData>` component to set parent state. Takes an optional `component` prop which will wrap the children in this component.
**WARNING** The `<TableHeader>` components must be the children of this component to correctly build the headers.

### `<HeaderData>`

A component that builds the column data and calls `setHeaderData` to save columns to the parent state. The render method returns `null`

#### `<TableHeader>`

A component to help with handling sorting columns. Reads the state from context and passes computed values that can be used with render props. If the column has a `sortable` prop, it will pass

- `isSorting`: if sorting, passes `'asc'` or `'desc'`, if no sorting set, passes `undefined`
- `sortable`: Prop passed through from component itself
- `filterable`: Prop passed through from component itself
- `onClick`: Function which wraps `handleSort` which automatically reads `e.shiftKey` from the click event and passes to `handleSort`
