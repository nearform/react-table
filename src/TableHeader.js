import React from 'react'
import PropTypes from 'prop-types'
import { TableConsumer } from './TableContext'

export class TableHeader extends React.Component {
  static propTypes = {
    render: PropTypes.func,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
      PropTypes.string,
      PropTypes.number
    ])
  }

  render() {
    const { render, component, children } = this.props

    return (
      <TableConsumer>
        {({ columns = [], sorting = [], handleSort } = {}) => {
          const { accessor, filterable = false, sortable = false } = this.props
          const isSorting = sorting.find(column => column.id === accessor)
          const returnProps = {
            ...{ ...this.props, sortable: null, filterable: null },
            ...(sortable && typeof component !== 'string'
              ? {
                  isSorting,
                  sortable,
                  filterable,
                  onClick: e => {
                    const isMultipleSelect = e.shiftKey
                    return handleSort(accessor, isMultipleSelect)
                  }
                }
              : {}),
            ...(sortable &&
              typeof component === 'string' &&
              isSorting && {
                issorting: isSorting.asc ? 'asc' : 'desc'
              }),
            ...(sortable &&
              typeof component === 'string' && {
                onClick: e => {
                  const isMultipleSelect = e.shiftKey
                  return handleSort(accessor, isMultipleSelect)
                }
              })
          }

          return component
            ? React.createElement(component, returnProps, children)
            : render
              ? render(returnProps)
              : typeof children === 'function'
                ? children(returnProps)
                : children
        }}
      </TableConsumer>
    )
  }
}
