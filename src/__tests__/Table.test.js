import React from 'react'
import { render } from 'react-testing-library'
import { Table, TableHeaderRow, TableHeader } from '..'

const initializeTable = props => {
  const data = [{ id: 1, animal: 'dog' }, { id: 2, animal: 'cat' }]
  const headerData = {
    columns: [
      {
        accessor: 'animal',
        label: 'Animals',
        sortable: true,
        filterable: false
      }
    ]
  }
  const mockRender = jest.fn()
  const renderObj = render(<Table render={mockRender} data={data} {...props} />)

  expect(mockRender.mock.calls[0][0].setHeaderData).toBeDefined()
  mockRender.mock.calls[0][0].setHeaderData(headerData)
  const tableProps = mockRender.mock.calls[1][0]
  mockRender.mockReset()
  let index = 0

  return {
    tableProps,
    renderObj,
    mockRender,
    getNextProps: () => {
      return mockRender.mock.calls[index++][0]
    }
  }
}

test('tests work', () => {
  expect(1 + 2).toBe(3)
})

test('uses render prop', () => {
  const mockRender = jest.fn()
  render(<Table render={mockRender} />)

  expect(mockRender).toHaveBeenCalledTimes(1)
})

test('uses children function', () => {
  const children = jest.fn(() => <div>Value</div>)
  render(<Table>{children}</Table>)

  expect(children).toHaveBeenCalledTimes(1)
})

test('uses children prop', () => {
  const Children = jest.fn(() => <div>Value</div>)
  render(
    <Table>
      <Children />
    </Table>
  )

  expect(Children).toHaveBeenCalledTimes(1)
})

test('no children', () => {
  const { container } = render(<Table />)

  expect(container.innerHTML).toBe('')
})

test('handles multiple children', () => {
  const error = console.error
  console.error = jest.fn()
  expect(() => {
    render(
      <Table>
        <div />
        <div />
      </Table>
    )
  }).toThrow()
  console.error = error
})

test('handles no children', () => {
  const mockChildren = jest.fn()
  render(<Table />)

  expect(mockChildren.mock.calls.length).toBe(0)
})

test('uses component prop', () => {
  const comp = props => <div className="my-comp" />
  const { container } = render(<Table component={comp} />)

  expect(container.querySelector('.my-comp')).toBeDefined()
})

test('initial default data and computed values set correctly', () => {
  const mockRender = jest.fn()
  render(<Table render={mockRender} />)

  const props = mockRender.mock.calls[0][0]

  // default
  expect(props.columns).toEqual(Table.defaultProps.columns)
  expect(props.data).toEqual(Table.defaultProps.data)
  expect(props.currentPage).toBe(Table.defaultProps.currentPage)
  expect(props.pageSize).toBe(Table.defaultProps.pageSize)
  expect(props.pageSizeOptions).toBe(Table.defaultProps.pageSizeOptions)

  // computed
  expect(props.rows).toEqual([])
  expect(props.total).toBe(0)
  expect(props.hasPrevPage).toBeFalsy()
  expect(props.hasNextPage).toBeFalsy()
  expect(props.totalNumberOfPages).toBe(0)
})

test('setTableState updates state correct', () => {
  const mockRender = jest.fn()
  render(<Table render={mockRender} />)

  const newPageOptions = [1, 2, 3]
  const mockCallback = jest.fn()
  const firstCall = mockRender.mock.calls[0][0]
  const { setTableState, pageSizeOptions: initialPageSizeOptions } = firstCall

  // confirms setTableState is a function
  expect(setTableState).toBeDefined()
  expect(typeof setTableState).toBe('function')

  // default options
  expect(initialPageSizeOptions).toEqual([8, 16, 24, 48])

  // calls setState on parent
  setTableState({ pageSizeOptions: newPageOptions }, mockCallback)

  const secondCall = mockRender.mock.calls[1][0]
  const { pageSizeOptions: secondPageSizeOptions } = secondCall

  // test new options
  expect(expect(secondPageSizeOptions).toEqual(newPageOptions))
  // tests setState callback fired
  expect(mockCallback).toHaveBeenCalledTimes(1)
})

test('setHeaderData ignores empty columns', () => {
  const mockRender = jest.fn()
  render(<Table render={mockRender} data={[]} />)

  const { setHeaderData } = mockRender.mock.calls[0][0]

  setHeaderData()

  expect(mockRender.mock.calls[1][0].columns).toEqual([])

  setHeaderData({ columns: { foo: 'foo' } })
})

test('setHeaderData ignores empty columns', () => {
  const mockRender = jest.fn()
  render(<Table render={mockRender} data={[]} />)

  const { setHeaderData } = mockRender.mock.calls[0][0]

  setHeaderData({ columns: { foo: 'foo' } })

  expect(mockRender.mock.calls).toHaveLength(1)
})

test('generate rows from columns with columns object set', () => {
  const data = [{ id: 1, animal: 'dog' }, { id: 2, animal: 'cat' }]
  const headerData = {
    columns: [
      {
        accessor: 'animal',
        label: 'Animals',
        sortable: false,
        filterable: false
      }
    ]
  }
  const mockRender = jest.fn()
  render(<Table render={mockRender} data={data} />)

  const { setHeaderData, columns: initialColumns } = mockRender.mock.calls[0][0]

  expect(initialColumns).toEqual([])
  expect(setHeaderData).toBeDefined()
  expect(typeof setHeaderData).toBe('function')

  setHeaderData(headerData)

  const { columns, rows } = mockRender.mock.calls[1][0]

  expect(columns).toEqual(headerData.columns)

  expect(rows.length).toBe(2)
  expect(rows[0].rowData[0].data).toBe('dog')
  expect(rows[0].rowData[0].accessor).toBe('animal')
  expect(rows[0].rowData[0].key).toBeDefined()
  expect(rows[0].rowData[0].type).toBe('data-row')
})

test('paging forwards and backwards works', () => {
  const { tableProps, getNextProps } = initializeTable({ pageSize: 1 })
  const { handleNextPage, handlePrevPage } = tableProps
  expect(handleNextPage).toBeDefined()
  expect(typeof handleNextPage).toBe('function')
  expect(handlePrevPage).toBeDefined()
  expect(typeof handlePrevPage).toBe('function')

  expect(tableProps.hasNextPage).toBeTruthy()
  expect(tableProps.hasPrevPage).toBeFalsy()
  expect(tableProps.rows[0].rowData[0].data).toBe('dog')

  const nextPreventDefault = jest.fn()
  handleNextPage({ preventDefault: nextPreventDefault })
  expect(nextPreventDefault).toHaveBeenCalledTimes(1)

  const nextPageProps = getNextProps()
  expect(nextPageProps.hasNextPage).toBeFalsy()
  expect(nextPageProps.hasPrevPage).toBeTruthy()
  expect(nextPageProps.rows[0].rowData[0].data).toBe('cat')

  const prevPreventDefault = jest.fn()
  handlePrevPage({ preventDefault: prevPreventDefault })
  expect(prevPreventDefault).toHaveBeenCalledTimes(1)

  const prevPageProps = getNextProps()
  expect(prevPageProps.hasNextPage).toBeTruthy()
  expect(prevPageProps.hasPrevPage).toBeFalsy()
  expect(prevPageProps.rows[0].rowData[0].data).toBe('dog')
})

test('bad paging forwards and backwards works', () => {
  const mockRender = jest.fn()
  render(<Table data={[]} render={mockRender} />)
  const { handleNextPage, handlePrevPage } = mockRender.mock.calls[0][0]
  expect(mockRender.mock.calls).toHaveLength(1)
  const prevPreventDefault = jest.fn()
  const nextPreventDefault = jest.fn()
  handlePrevPage({ preventDefault: prevPreventDefault })
  expect(prevPreventDefault).toHaveBeenCalledTimes(1)
  expect(mockRender.mock.calls).toHaveLength(1)

  handleNextPage({ preventDefault: nextPreventDefault })
  expect(nextPreventDefault).toHaveBeenCalledTimes(1)
  expect(mockRender.mock.calls).toHaveLength(1)
})

test('change page successfully', () => {
  const { tableProps, getNextProps } = initializeTable({ pageSize: 1 })

  expect(tableProps.selectedPage).toBe(1)
  expect(tableProps.currentPage).toBe(1)
  expect(tableProps.totalNumberOfPages).toBe(2)
  const preventDefault = jest.fn()

  tableProps.handlePageChange({ preventDefault, target: { value: 2 } })

  expect(preventDefault).toHaveBeenCalledTimes(1)
  const { selectedPage, currentPage } = getNextProps()

  expect(selectedPage).toBe(2)
  expect(currentPage).toBe(1)

  tableProps.handlePageChangeBlur({ preventDefault, target: { value: 2 } })

  const {
    selectedPage: selectedPageBlur,
    currentPage: currentPageBlur
  } = getNextProps()
  expect(selectedPageBlur).toBe(2)
  expect(currentPageBlur).toBe(2)
})

test('change page revert back to original value', () => {
  const { tableProps, getNextProps } = initializeTable({ pageSize: 1 })

  expect(tableProps.selectedPage).toBe(1)
  expect(tableProps.currentPage).toBe(1)
  expect(tableProps.totalNumberOfPages).toBe(2)
  const preventDefault = jest.fn()

  tableProps.handlePageChange({ preventDefault, target: { value: 2 } })

  expect(preventDefault).toHaveBeenCalledTimes(1)
  const { selectedPage, currentPage } = getNextProps()

  expect(selectedPage).toBe(2)
  expect(currentPage).toBe(1)

  tableProps.handlePageChangeBlur({ preventDefault, target: { value: '' } })

  const {
    selectedPage: selectedPageBlur,
    currentPage: currentPageBlur
  } = getNextProps()
  expect(selectedPageBlur).toBe(1)
  expect(currentPageBlur).toBe(1)
})

test('changing page size', () => {
  const { tableProps, getNextProps } = initializeTable({ pageSize: 1 })
  const { hasNextPage, hasPrevPage, totalNumberOfPages, pageSize } = tableProps

  expect(totalNumberOfPages).toBe(2)
  expect(pageSize).toBe(1)
  expect(hasNextPage).toBeTruthy()
  expect(hasPrevPage).toBeFalsy()

  const preventDefault = jest.fn()
  tableProps.handlePageSizeChange({ preventDefault, target: { value: 2 } })
  const changedData = getNextProps()

  expect(preventDefault).toHaveBeenCalledTimes(1)
  expect(changedData.totalNumberOfPages).toBe(1)
  expect(changedData.hasNextPage).toBeFalsy()
  expect(changedData.hasPrevPage).toBeFalsy()
  expect(changedData.pageSize).toBe(2)
})

test('sorting column - no multiple select', () => {
  const { tableProps, getNextProps } = initializeTable()

  expect(tableProps.rows[0].rowData[0].data).toBe('dog')
  tableProps.handleSort('animal')
  const nextProps = getNextProps()
  expect(nextProps.rows[0].rowData[0].data).toBe('cat')
})

test('sorting column - multiple select', () => {
  const { tableProps, getNextProps } = initializeTable()

  expect(tableProps.rows[0].rowData[0].data).toBe('dog')
  tableProps.handleSort('animal', true)
  const nextProps = getNextProps()
  expect(nextProps.rows[0].rowData[0].data).toBe('cat')
  nextProps.handleSort('animal', true)

  expect(nextProps.rows[0].rowData[0].data).toBe('cat')
})

test('filter column ', () => {
  const { tableProps, getNextProps } = initializeTable()

  expect(tableProps.rows.length).toBe(2)
  tableProps.handleFilter('animal', 'd')
  const nextProps = getNextProps()

  expect(nextProps.rows.length).toBe(1)
  expect(nextProps.rows[0].rowData[0].data).toBe('dog')

  nextProps.handleFilter('animal', 'do')

  const nextProps2 = getNextProps()
  expect(nextProps2.rows.length).toBe(1)
  expect(nextProps.rows[0].rowData[0].data).toBe('dog')
})

test('handle select row', () => {
  const data = [{ foo: 'bar' }]
  const mockRender = jest.fn(() => (
    <TableHeaderRow>
      <TableHeader accessor="foo">Foo</TableHeader>
    </TableHeaderRow>
  ))
  render(<Table data={data} render={mockRender} />)
  const { rows, selecting, handleRowSelect } = mockRender.mock.calls[1][0]
  expect(selecting).toEqual([])
  const rowKey = rows[0].rowKey
  handleRowSelect(rowKey)

  const {
    selecting: [newSelecting]
  } = mockRender.mock.calls[2][0]
  expect(newSelecting).toBe(rowKey)

  handleRowSelect(rowKey)

  expect(mockRender.mock.calls[3][0].selecting).toEqual([])
})

test('handle select row all', () => {
  const data = [{ foo: 'bar' }]
  const mockRender = jest.fn(() => (
    <TableHeaderRow>
      <TableHeader accessor="foo">Foo</TableHeader>
    </TableHeaderRow>
  ))
  render(<Table data={data} render={mockRender} />)
  const { selecting, handleRowSelect } = mockRender.mock.calls[1][0]
  expect(selecting).toEqual([])

  handleRowSelect('all')

  const {
    selecting: [newSelecting]
  } = mockRender.mock.calls[2][0]
  expect(newSelecting).toBe('all')

  handleRowSelect('all')
  expect(mockRender.mock.calls[3][0].selecting).toEqual([])
})

test('handle empty row', () => {
  const mockRender = jest.fn(() => (
    <TableHeaderRow>
      <div>Label</div>
    </TableHeaderRow>
  ))

  render(<Table data={[{ id: 1 }]} render={mockRender} />)
  expect(mockRender.mock.calls[1][0].rows[0].rowData[0].type).toBe('empty-row')
})

test('add row after initial render', () => {
  const mockRender = jest.fn(() => (
    <TableHeaderRow>
      <TableHeader accessor="foo" sortable filterable>
        Table Header 1
      </TableHeader>
    </TableHeaderRow>
  ))

  render(
    <Table
      data={[{ id: 1, foo: 'Foo Table Data Value' }]}
      render={mockRender}
    />
  )
  const tableProps = mockRender.mock.calls[1][0]
  expect(tableProps.handleAddRow).toBeDefined()
  expect(typeof tableProps.handleAddRow).toBe('function')

  tableProps.handleAddRow({ id: 2, foo: 'Foo Table Data Value Two' })

  const tablePropsRows = mockRender.mock.calls[2][0].rows[1]

  expect(tablePropsRows).toBeDefined()
  expect(tablePropsRows.rowData[0].data).toBe('Foo Table Data Value Two')
  expect(tablePropsRows.rowKey).toBeTruthy()
})

test('remove row after initial render', () => {
  const mockRender = jest.fn(() => (
    <TableHeaderRow>
      <TableHeader accessor="foo" sortable filterable>
        Table Header 1
      </TableHeader>
    </TableHeaderRow>
  ))

  render(
    <Table
      data={[{ id: 1, foo: 'Foo Table Data Value' }]}
      render={mockRender}
    />
  )
  let tableProps = mockRender.mock.calls[1][0]
  // add row dynamically
  tableProps.handleAddRow({ id: 2, foo: 'Foo Table Data Value Two' })

  tableProps = mockRender.mock.calls[2][0]

  // confirm row added
  expect(tableProps.rows).toHaveLength(2)

  // confirm handleDeleteRow is returned
  expect(tableProps.handleDeleteRow).toBeDefined()
  expect(typeof tableProps.handleDeleteRow).toBe('function')

  // remove first row from table
  tableProps.handleDeleteRow(tableProps.rows[0].rowKey)

  tableProps = mockRender.mock.calls[3][0]

  // confirm row removed
  expect(tableProps.rows).toHaveLength(1)

  // confirm only row is second element added
  expect(tableProps.rows[0].rowData[0].data).toBe('Foo Table Data Value Two')
})

test('remove row sets correct total values', () => {
  const mockRender = jest.fn(() => (
    <TableHeaderRow>
      <TableHeader accessor="foo" sortable filterable>
        Table Header 1
      </TableHeader>
    </TableHeaderRow>
  ))

  render(
    <Table
      data={[
        { id: 1, foo: 'Foo Table Data Value' },
        { id: 2, foo: 'Foo Table Data Value 2' },
        { id: 3, foo: 'Foo Table Data Value 3' }
      ]}
      render={mockRender}
    />
  )
  let tableProps = mockRender.mock.calls[1][0]
  expect(tableProps.total).toBe(3)

  tableProps.handleDeleteRow(tableProps.rows[0].rowKey)
  tableProps = mockRender.mock.calls[2][0]
  expect(tableProps.total).toBe(2)
})

test('delete rows in selecting array', () => {
  const mockRender = jest.fn(() => (
    <TableHeaderRow>
      <TableHeader accessor="foo" sortable filterable>
        Table Header 1
      </TableHeader>
    </TableHeaderRow>
  ))

  render(
    <Table
      data={[
        { id: 1, foo: 'Foo Table Data Value' },
        { id: 2, foo: 'Foo Table Data Value 2' },
        { id: 3, foo: 'Foo Table Data Value 3' }
      ]}
      render={mockRender}
    />
  )
  let tableProps = mockRender.mock.calls[1][0]
  expect(tableProps.total).toBe(3)
  tableProps.handleRowSelect(tableProps.rows[0].rowKey)
  tableProps.handleRowSelect(tableProps.rows[1].rowKey)
  tableProps.handleRowSelect(tableProps.rows[2].rowKey)

  tableProps = mockRender.mock.calls[4][0]
  expect(tableProps.selecting).toHaveLength(3)
  tableProps.handleDeleteAllSelecting()

  tableProps = mockRender.mock.calls[8][0]
  expect(tableProps.rows).toHaveLength(0)
  expect(tableProps.total).toBe(0)
  expect(tableProps.selecting).toHaveLength(0)
})

test('delete rows in selecting array with "all" set', () => {
  const mockRender = jest.fn(() => (
    <TableHeaderRow>
      <TableHeader accessor="foo" sortable filterable>
        Table Header 1
      </TableHeader>
    </TableHeaderRow>
  ))

  render(
    <Table
      data={[
        { id: 1, foo: 'Foo Table Data Value' },
        { id: 2, foo: 'Foo Table Data Value 2' },
        { id: 3, foo: 'Foo Table Data Value 3' }
      ]}
      render={mockRender}
    />
  )
  let tableProps = mockRender.mock.calls[1][0]
  expect(tableProps.total).toBe(3)
  tableProps.handleRowSelect('all')

  tableProps = mockRender.mock.calls[2][0]
  expect(tableProps.selecting[0]).toBe('all')
  tableProps.handleDeleteAllSelecting()

  tableProps = mockRender.mock.calls[7][0]
  expect(tableProps.rows).toHaveLength(0)
  expect(tableProps.total).toBe(0)
  expect(tableProps.selecting).toHaveLength(0)
})

test('modify a row after initial render', () => {
  const mockRender = jest.fn(() => (
    <TableHeaderRow>
      <TableHeader accessor="foo" sortable filterable>
        Table Header 1
      </TableHeader>
    </TableHeaderRow>
  ))

  render(
    <Table
      data={[
        { id: 1, foo: 'Foo Table Data Value' },
        { id: 2, foo: 'foo foo foo' }
      ]}
      render={mockRender}
    />
  )
  let tableProps = mockRender.mock.calls[1][0]

  expect(tableProps.handleEditRow).toBeDefined()
  expect(typeof tableProps.handleEditRow).toBe('function')

  tableProps.handleEditRow(tableProps.rows[0].rowKey, {
    id: 123,
    foo: 'A new table value'
  })
  tableProps = mockRender.mock.calls[2][0]

  expect(tableProps.rows[0].rowData[0].data).toBe('A new table value')
})

test('edit a column in a row', () => {
  const mockRender = jest.fn(() => (
    <TableHeaderRow>
      <TableHeader accessor="foo" sortable filterable>
        Table Header 1
      </TableHeader>
      <TableHeader accessor="modifyMe" sortable filterable>
        Table Header 2
      </TableHeader>
    </TableHeaderRow>
  ))

  render(
    <Table
      data={[
        { id: 1, foo: 'Foo Table Data Value', modifyMe: 'abc' },
        { id: 2, foo: 'foo foo foo', modifyMe: '123' }
      ]}
      render={mockRender}
    />
  )
  let tableProps = mockRender.mock.calls[1][0]
  const rowKey = tableProps.rows[0].rowKey
  tableProps.handleEditColumn(rowKey, 'modifyMe', 'modified column in a row')

  tableProps = mockRender.mock.calls[2][0]

  expect(tableProps.rows[0].rowData[1].data).toBe('modified column in a row')
})

test('refresh state when data changes', () => {
  const mockRender = jest.fn(() => (
    <TableHeaderRow>
      <TableHeader accessor="foo" sortable filterable>
        Table Header 1
      </TableHeader>
      <TableHeader accessor="modifyMe" sortable filterable>
        Table Header 2
      </TableHeader>
    </TableHeaderRow>
  ))

  const data = [
    { id: 1, foo: 'Foo Table Data Value 1' },
    { id: 2, foo: 'Foo Table Data Value 2' }
  ]

  const updatedData = [
    { id: 1, foo: 'Foo Table Data Value 1' },
    { id: 2, foo: 'Foo Table Data Value 2' },
    { id: 2, foo: 'Foo Table Data Value 3' },
    { id: 2, foo: 'Foo Table Data Value 4' },
    { id: 2, foo: 'Foo Table Data Value 5' }
  ]

  const { rerender } = render(<Table data={data} render={mockRender} />)
  const tableProps = mockRender.mock.calls[1][0]
  expect(tableProps._data).toEqual(data)

  rerender(<Table data={updatedData} render={mockRender} />)

  const updatedDataProps = mockRender.mock.calls[2][0]
  expect(updatedDataProps._data).toEqual(updatedData)
})
