import React from 'react'
import { render } from 'react-testing-library'
import { Table, TableHeaderRow, HeaderData } from '..'

describe('TableHeaderRow', () => {
  test('renders without Provider set', () => {
    const { container } = render(<TableHeaderRow />)

    expect(container.tagName.toLowerCase()).toMatch('div')
  })

  test('wraps with component prop', () => {
    const { queryAllByText } = render(
      <table>
        <TableHeaderRow component="thead">
          <tr>
            <th>Header content 1</th>
            <th>Header content 2</th>
          </tr>
        </TableHeaderRow>
      </table>
    )

    expect(queryAllByText('Header content', { exact: false })).toHaveLength(2)
  })

  test('calls setHeaderData with no columns', () => {
    const { queryAllByText } = render(
      <Table
        render={tableProps => (
          <table>
            <TableHeaderRow component="thead" />
            {tableProps.columns.map(column => (
              <tr>
                <th>Generated Column</th>
              </tr>
            ))}
          </table>
        )}
      />
    )

    expect(queryAllByText('Generated Column', { exact: false })).toHaveLength(0)
  })
})

describe('HeaderData', () => {
  test('renders without error', () => {
    const { container } = render(<HeaderData />)

    expect(container.innerHTML).toBe('')
  })

  test('calls setHeaderData only ONCE with no children values', () => {
    const setHeaderData = jest.fn()

    const { rerender } = render(<HeaderData setHeaderData={setHeaderData} />)

    expect(setHeaderData).toHaveBeenCalledTimes(1)
    expect(setHeaderData).toHaveBeenCalledWith({ columns: [] })

    rerender(<HeaderData setHeaderData={setHeaderData} />)
    expect(setHeaderData).toHaveBeenCalledTimes(1)
  })

  test('builds correct column object shape', () => {
    const setHeaderData = jest.fn()

    const { rerender } = render(
      <HeaderData setHeaderData={setHeaderData}>
        <div accessor="foo" sortable={false} filterable={true}>
          Foo
        </div>
        <div>Nothing</div>
        <div accessor="bar" sortable={true} filterable={false}>
          Bar
        </div>
      </HeaderData>
    )

    expect(setHeaderData).toHaveBeenCalledTimes(1)
    expect(setHeaderData).toHaveBeenCalledWith({
      columns: [
        {
          accessor: 'foo',
          label: 'Foo',
          sortable: false,
          filterable: true
        },
        {
          accessor: false,
          label: 'Nothing',
          sortable: false,
          filterable: false
        },
        {
          accessor: 'bar',
          label: 'Bar',
          sortable: true,
          filterable: false
        }
      ]
    })

    rerender(
      <HeaderData setHeaderData={setHeaderData} shouldUpdateParent={true} />
    )
    expect(setHeaderData).toHaveBeenCalledTimes(1)
  })
})
