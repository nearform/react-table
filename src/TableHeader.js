import React from 'react'
import { TableConsumer } from './TableContext'

export class TableHeader extends React.Component {
  render() {
    return (
      <TableConsumer>
        {({ columns, sorting, handleSort }) => {
          const { accessor, sortable } = this.props
          const isSorting = sorting.find(column => column.id === accessor)

          return (
            <div
              className={`td ${sortable ? 'sortable' : 'no-sortable'} ${
                isSorting ? (isSorting.asc ? 'asc' : 'desc') : ''
              }`}
              {...sortable && {
                onClick: e => {
                  const isMultipleSelect = e.shiftKey
                  return handleSort(accessor, isMultipleSelect)
                }
              }}
            >
              {this.props.children}
            </div>
          )
        }}
      </TableConsumer>
    )
  }
}
