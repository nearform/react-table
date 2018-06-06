import React from 'react'
import { TableConsumer } from './TableContext'

export class TableHeader extends React.Component {
  render() {
    const { className, style, component } = this.props

    return (
      <TableConsumer>
        {({ columns = [], sorting = [], handleSort } = {}) => {
          const { children, accessor, sortable = false } = this.props
          const isSorting = sorting.find(column => column.id === accessor)

          return component ? (
            React.createElement(
              component,
              {
                className,
                style,
                ...(sortable && typeof component !== 'string'
                  ? {
                      isSorting,
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
              },
              children
            )
          ) : (
            <div
              style={style}
              className={`${className ? `${className} ` : ''}${
                sortable ? 'sortable' : 'no-sortable'
              } ${isSorting ? (isSorting.asc ? 'asc' : 'desc') : ''}`}
              {...sortable && {
                onClick: e => {
                  const isMultipleSelect = e.shiftKey
                  return handleSort(accessor, isMultipleSelect)
                }
              }}
            >
              {typeof this.props.children === 'function'
                ? this.props.children({
                    isSorting
                  })
                : this.props.children}
            </div>
          )
        }}
      </TableConsumer>
    )
  }
}
