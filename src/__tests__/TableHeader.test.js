import React from 'react'
import { TableHeader } from '..'
import { render } from 'react-testing-library'

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
