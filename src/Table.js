import React from 'react'
import _ from 'lodash'

export const {
  Provider: TableProvider,
  Consumer: TableConsumer
} = React.createContext()

export class TableContainer extends React.Component {
  render() {
    return <div className="table">{this.props.children}</div>
  }
}

export function TableHeaderRow(props) {
  return (
    <TableConsumer>
      {({ setHeaderData }) => (
        <TableHeaderRowWithData {...props} setHeaderData={setHeaderData} />
      )}
    </TableConsumer>
  )
}
class TableHeaderRowWithData extends React.Component {
  state = {
    columns: React.Children.map(this.props.children, ({ props }) => ({
      accessor: props.accessor,
      label: props.children,
      sortable: props.sortable || false,
      filterable: props.filterable || false
    })),
    shouldUpdateParent: true
  }

  setParentData = () => {
    this.setState(
      state => ({
        shouldUpdateParent: false
      }),
      this.props.setHeaderData(this.state)
    )
  }

  componentDidMount() {
    if (this.state.shouldUpdateParent) {
      this.setParentData()
    }
  }

  componentDidUpdate() {
    if (this.state.shouldUpdateParent) {
      this.setParentData()
    }
  }

  render() {
    return <div className="tr th">{this.props.children}</div>
  }
}

export class TableHeader extends React.Component {
  render() {
    return (
      <TableConsumer>
        {({ columns, sorting, handleSort }) => {
          const { accessor, sortable } = this.props
          const isSorting = sorting.find(column => column.id === accessor)
          let styles = isSorting
            ? isSorting.asc
              ? { borderTop: '4px solid black' }
              : { borderBottom: '4px solid black' }
            : {}

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

export class TableDataRow extends React.Component {
  render() {
    return (
      <TableConsumer>{({ rows }) => this.props.render(rows)}</TableConsumer>
    )
  }
}

export class TableFooter extends React.Component {
  render() {
    return this.props.render()
  }
}

export class TableFilterRow extends React.Component {
  render() {
    return (
      <TableConsumer>
        {({ columns }) => (
          <div className="tr">{this.props.children(columns)}</div>
        )}
      </TableConsumer>
    )
  }
}

export class Table extends React.Component {
  state = {
    columns: this.props.columns,
    data: this.props.data,
    sorting: [],
    filtering: [],
    paging: {
      total: this.props.data.length,
      pageSize: this.props.pageSize,
      currentPage: this.props.currentPage,
      selectedPage: this.props.currentPage,
      pageSizeOptions: this.props.pageSizeOptions
    }
  }

  static defaultProps = {
    columns: [],
    accessors: [],
    data: [],
    currentPage: 1,
    pageSize: 8,
    pageSizeOptions: [8, 16, 24, 48]
  }

  setHeaderData = ({ columns }) => {
    this.setState(state => ({
      columns
    }))
  }

  getComputedRows = () => {
    const {
      columns,
      data,
      paging: { currentPage, pageSize },
      sorting,
      filtering
    } = this.state

    const start = (currentPage - 1) * pageSize
    const end = start + pageSize

    const iteratees = sorting.map(({ id }) => id)
    const orders = sorting.map(({ asc }) => (asc ? 'asc' : 'desc'))

    const filterPredicate = filtering.reduce((accum, { id, value }) => {
      accum[id] = n => n.toLowerCase().includes(value.toLowerCase())

      return accum
    }, {})

    const orderedRows = _.orderBy(data, iteratees, orders)
    const filteredRows = _.filter(orderedRows, _.conforms(filterPredicate))

    return {
      rows: filteredRows.slice(start, end).map((row, index) => {
        return columns.map(({ accessor }) => {
          return {
            id: row.id,
            row: index,
            accessor,
            data: row[accessor]
          }
        })
      })
    }
  }

  getComputedPagingInfo = () => {
    const {
      paging: { pageSize, total, currentPage }
    } = this.state

    const totalNumberOfPages = Math.ceil(total / pageSize)

    return {
      paging: {
        ...this.state.paging,
        totalNumberOfPages,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage !== totalNumberOfPages,
        handleNextPage: this.handleNextPage,
        handlePrevPage: this.handlePrevPage,
        handlePageChange: this.handlePageChange,
        handlePageChangeBlur: this.handlePageChangeBlur,
        handlePageSizeChange: this.handlePageSizeChange
      }
    }
  }

  handlePrevPage = e => {
    e && e.preventDefault()

    this.setState(state => {
      if (state.paging.currentPage > 1) {
        const currentPage = state.paging.currentPage - 1

        return {
          paging: {
            ...state.paging,
            selectedPage: currentPage,
            currentPage
          }
        }
      }
    })
  }

  handleNextPage = e => {
    e && e.preventDefault()

    this.setState(state => {
      const {
        paging: { total, pageSize, currentPage }
      } = state
      const hasNextPage = currentPage < Math.ceil(total / pageSize)
      if (hasNextPage) {
        const currentPage = state.paging.currentPage + 1

        return {
          paging: {
            ...state.paging,
            selectedPage: currentPage,
            currentPage
          }
        }
      }
    })
  }

  handlePageChange = e => {
    e && e.preventDefault()

    const inputValue = Number(e.target.value)

    this.setState(state => {
      return {
        paging: {
          ...state.paging,
          selectedPage: inputValue
        }
      }
    })
  }

  handlePageChangeBlur = e => {
    e && e.preventDefault()

    const inputValue = Number(e.target.value)
    const {
      paging: { total, pageSize }
    } = this.state

    const isValidValue =
      inputValue !== '' &&
      Number.isInteger(inputValue) &&
      inputValue > 0 &&
      inputValue <= Math.ceil(total / pageSize)

    if (isValidValue) {
      return this.setState(state => {
        return {
          paging: {
            ...state.paging,
            selectedPage: inputValue,
            currentPage: inputValue
          }
        }
      })
    }

    return this.setState(state => {
      return {
        paging: {
          ...state.paging,
          selectedPage: state.paging.currentPage,
          currentPage: state.paging.currentPage
        }
      }
    })
  }

  handlePageSizeChange = e => {
    const pageSize = e.target.value

    this.setState(state => ({
      paging: {
        ...state.paging,
        pageSize
      }
    }))
  }

  handleSort = (columnAccessor, multipleSelect) => {
    this.setState(state => {
      const { sorting } = state

      const sortedColumn = sorting.find(sort => sort.id === columnAccessor)

      return {
        sorting: [
          ...(multipleSelect
            ? sorting.filter(({ id }) => id !== columnAccessor)
            : []),
          ...(sortedColumn
            ? { ...sortedColumn, asc: !sortedColumn.asc }
            : { id: columnAccessor, asc: true })
        ]
      }
    })
  }

  handleFilter = (columnAccessor, value) => {
    this.setState(state => {
      const { filtering } = state

      const filteredColumn = filtering.find(({ id }) => id === columnAccessor)

      return {
        filtering: [
          ...filtering.filter(({ id }) => id !== columnAccessor),
          ...(filteredColumn
            ? { ...filteredColumn, value }
            : { id: columnAccessor, value })
        ]
      }
    })
  }

  getRenderProps = () => {
    return {
      ...this.state,
      setHeaderData: this.setHeaderData,
      handleSort: this.handleSort,
      handleFilter: this.handleFilter,
      ...this.getComputedRows(),
      ...this.getComputedPagingInfo()
    }
  }

  render() {
    const { component, render, children } = this.props
    const props = this.getRenderProps()
    const ctx = this.getRenderProps()

    return (
      <TableProvider value={ctx}>
        {component
          ? React.createElement(component, props)
          : render
            ? render(props)
            : children
              ? typeof children === 'function'
                ? children(props)
                : !React.Children.count(children) === 0
                  ? React.Children.only(children)
                  : null
              : null}
      </TableProvider>
    )
  }
}
