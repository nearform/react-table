import React from 'react'
import { Table, TableHeaderRow, TableHeader } from '..'
import { render, renderIntoDocument, fireEvent } from 'react-testing-library'

test('renders correctly with no props', () => {
  render(<TableHeader />)
})

test('renders correctly with component wrapper', () => {
  const Wrapper = props => <div data-testid="wrapper" />
  const { getByTestId } = render(
    <TableHeader component={Wrapper}>Foo</TableHeader>
  )
  const wrapperComponent = getByTestId('wrapper')
  expect(wrapperComponent).toBeDefined()
})

test('renders correctly with className', () => {
  render(<TableHeader className="foo" />)
})

test('toggles header values with component', () => {
  const { getByText } = renderIntoDocument(
    <Table
      render={tableProps => {
        return (
          <table>
            <TableHeaderRow component="thead">
              <tr>
                <TableHeader accessor="foo" component="th" sortable>
                  Foo
                </TableHeader>
              </tr>
            </TableHeaderRow>
          </table>
        )
      }}
    />
  )

  const header = getByText('Foo')
  expect(header.getAttribute('issorting')).toBeNull()

  fireEvent(
    header,
    new MouseEvent('click', {
      bubbles: true, // click events must bubble for React to see it
      cancelable: true
    })
  )

  expect(header.getAttribute('issorting')).toBe('asc')

  fireEvent(
    header,
    new MouseEvent('click', {
      bubbles: true, // click events must bubble for React to see it
      cancelable: true
    })
  )

  expect(header.getAttribute('issorting')).toBe('desc')
})

test('toggles header values WITHOUT component', () => {
  const { getByText } = renderIntoDocument(
    <Table
      render={tableProps => {
        return (
          <TableHeaderRow>
            <TableHeader accessor="foo" sortable>
              Foo
            </TableHeader>
          </TableHeaderRow>
        )
      }}
    />
  )

  const header = getByText('Foo')
  expect(header.getAttribute('class').trim()).toBe('sortable')

  fireEvent(
    header,
    new MouseEvent('click', {
      bubbles: true, // click events must bubble for React to see it
      cancelable: true
    })
  )

  expect(header.getAttribute('class')).toBe('sortable asc')

  fireEvent(
    header,
    new MouseEvent('click', {
      bubbles: true, // click events must bubble for React to see it
      cancelable: true
    })
  )

  expect(header.getAttribute('class')).toBe('sortable desc')
})

test('passes sorting render props with element', () => {
  const mockRender = jest.fn(() => <div>Foo</div>)
  const { getByText } = renderIntoDocument(
    <Table
      render={tableProps => {
        return (
          <TableHeaderRow>
            <TableHeader accessor="foo" sortable>
              {mockRender}
            </TableHeader>
          </TableHeaderRow>
        )
      }}
    />
  )
  fireEvent(
    getByText('Foo'),
    new MouseEvent('click', {
      bubbles: true, // click events must bubble for React to see it
      cancelable: true
    })
  )
  expect(mockRender).toHaveBeenCalled()
  expect(mockRender).toHaveBeenCalledWith({
    isSorting: { asc: true, id: 'foo' }
  })
})

test('passes sorting render props with component', () => {
  function Header({ onClick, isSorting = { asc: false }, children }) {
    return (
      <div>
        <button onClick={onClick}>Click Me</button>
        <h1>SORTING:{JSON.stringify(isSorting.asc)}</h1>
        <div>{children}</div>
      </div>
    )
  }

  const { getByText } = renderIntoDocument(
    <Table
      render={tableProps => {
        return (
          <TableHeaderRow>
            <TableHeader accessor="foo" sortable component={Header}>
              <div>Foo</div>
            </TableHeader>
          </TableHeaderRow>
        )
      }}
    />
  )

  fireEvent(
    getByText('Click Me'),
    new MouseEvent('click', {
      bubbles: true, // click events must bubble for React to see it
      cancelable: true
    })
  )

  expect(getByText(/SORTING/).innerHTML).toEqual('SORTING:true')
})
