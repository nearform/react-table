import React from 'react'
import { Table, TableHeaderRow, TableHeader } from '..'
import {
  render,
  renderIntoDocument,
  fireEvent,
  cleanup
} from 'react-testing-library'

afterEach(cleanup)

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
              {({ onClick, isSorting }) => (
                <div
                  onClick={onClick}
                  className={isSorting ? (isSorting.asc ? 'asc' : 'desc') : ''}
                >
                  Foo
                </div>
              )}
            </TableHeader>
          </TableHeaderRow>
        )
      }}
    />
  )

  const header = getByText('Foo')

  expect(header.getAttribute('class').trim()).toBe('')

  fireEvent(
    header,
    new MouseEvent('click', {
      bubbles: true, // click events must bubble for React to see it
      cancelable: true
    })
  )

  expect(header.getAttribute('class')).toBe('asc')

  fireEvent(
    header,
    new MouseEvent('click', {
      bubbles: true, // click events must bubble for React to see it
      cancelable: true
    })
  )

  expect(header.getAttribute('class')).toBe('desc')
})

test('passes sorting render props with element', () => {
  const mockRender = jest.fn(({ onClick }) => <div onClick={onClick}>Foo</div>)
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
  const { isSorting } = mockRender.mock.calls[2][0]
  expect(isSorting).toEqual({ asc: true, id: 'foo' })
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

test('passes return props with render prop', () => {
  const mockRender = jest.fn(({ onClick }) => <div onClick={onClick}>Foo</div>)
  const { getByText } = renderIntoDocument(
    <Table
      render={tableProps => {
        return (
          <TableHeaderRow>
            <TableHeader accessor="foo" sortable render={mockRender} />
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
  const { isSorting } = mockRender.mock.calls[2][0]
  expect(isSorting).toEqual({ asc: true, id: 'foo' })
})
