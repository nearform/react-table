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
    accessors: [],
    sorts: [],
    filters: [],
    shouldUpdateParent: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.accessors.length) {
      console.log('calculating new getDerivedStateFromProps')
      const { children } = nextProps
      const computedState = {
        shouldUpdateParent: true,
        accessors: React.Children.map(children, ({ props }) => props.accessor),
        sorts: React.Children.map(children, ({ props }) => props.sort || false),
        filters: React.Children.map(
          children,
          ({ props }) => props.filter || false
        )
      }
      console.log('new derived state value', computedState)
      return computedState
    }

    return null
  }

  componentDidMount() {
    if (this.state.shouldUpdateParent) {
      this.setState(
        state => ({
          shouldUpdateParent: false
        }),
        this.props.setHeaderData(this.state)
      )
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
        {({ sorting: { sortables, orders, handleSort } }) => {
          const { accessor } = this.props

          const index = sortables.indexOf(accessor)
          let styles = {}

          if (index > -1) {
            const order = orders[index]

            styles =
              order === 'asc'
                ? {
                    borderTop: '4px solid black'
                  }
                : order === 'desc'
                  ? {
                      borderBottom: '4px solid black'
                    }
                  : {}
          }

          return (
            <div
              className="td"
              style={{
                ...styles,
                cursor: this.props.sort ? 'pointer' : 'not-allowed'
              }}
              onClick={e => {
                e.preventDefault()
                const { accessor } = this.props
                const isMultipleSelect = e.shiftKey

                return handleSort(accessor, isMultipleSelect)
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
    return <div className="tr th">{this.props.children}</div>
  }
}

export class Table extends React.Component {
  state = {
    columns: this.props.columns,
    accessors: this.props.accessors,
    data: this.props.data,
    filtering: {
      filterValues: []
    },
    sorting: {
      orders: [],
      sortables: [],
      noSort: []
    },
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

  setHeaderData = ({ accessors, sorts, filters }) => {
    this.setState(state => ({
      columns: accessors,
      accessors,
      filtering: {
        ...state.filtering,
        noFilter: accessors.filter((accessors, index) => !filters[index])
      },
      sorting: {
        ...state.sorting,
        noSort: accessors.filter((accessor, index) => !sorts[index])
      }
    }))
  }

  getComputedRows = () => {
    const {
      data,
      accessors,
      paging: { currentPage, pageSize },
      sorting: { orders, sortables },
      filtering: { filterValues }
    } = this.state

    const start = (currentPage - 1) * pageSize
    const end = start + pageSize

    const filteredData = data.slice(start, end)
    const sortedDated = _.orderBy(filteredData, sortables, orders)

    return {
      rows: sortedDated.map((row, index) => {
        return accessors.map(accessor => {
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
      totalNumberOfPages,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage !== totalNumberOfPages
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
    const { sorting } = this.state

    if (sorting.noSort.includes(columnAccessor)) {
      return false
    }

    this.setState(state => {
      if (multipleSelect) {
        if (state.sorting.sortables.includes(columnAccessor)) {
          const index = state.sorting.sortables.indexOf(columnAccessor)
          const orders = state.sorting.orders
          const newOrder =
            orders[index] === '' ? 'asc' : orders[index] === 'asc' ? 'desc' : ''
          const newSortables =
            newOrder === 'asc' || newOrder === 'desc' ? columnAccessor : ''
          // just flip direction
          return {
            sorting: {
              ...state.sorting,
              sortables: [
                ...state.sorting.sortables.slice(0, index),
                newSortables,
                ...state.sorting.sortables.slice(index + 1)
              ].filter(i => i),
              orders: [
                ...orders.slice(0, index),
                newOrder,
                ...orders.slice(index + 1)
              ].filter(i => i)
            }
          }
        }

        return {
          sorting: {
            ...state.sorting,
            sortables: [...state.sorting.sortables, columnAccessor],
            orders: [...state.sorting.orders, 'asc']
          }
        }
      }

      // not multiple select, only sortable is columnAccessor
      if (state.sorting.sortables.includes(columnAccessor)) {
        const [order] = state.sorting.orders
        const newOrder = order === '' ? 'asc' : order === 'asc' ? 'desc' : ''
        const newSortables =
          newOrder === 'asc' || newOrder === 'desc' ? columnAccessor : ''
        // just flip direction
        return {
          sorting: {
            ...state.sorting,
            sortables: newSortables ? [newSortables] : [],
            orders: newOrder ? [newOrder] : []
          }
        }
      }

      return {
        sorting: {
          ...state.sorting,
          sortables: [columnAccessor],
          orders: ['asc']
        }
      }
    })
  }

  handleFilter = (columnAccessor, filterValue) => {
    const { filtering } = this.state

    if (filtering.noFilter.includes(columnAccessor)) {
      return false
    }

    this.setState(state => {
      return state.filtering.filterValues
        ? {
            filtering: {
              ...state.filtering,
              filterValues: [
                {
                  name: columnAccessor,
                  filterValue
                }
              ]
            }
          }
        : {
            filtering: {
              ...state.filtering,
              filterValues: state.filtering.filterValues.map(fv => {
                console.log('fv', fv)
                if (fv.name === columnAccessor) {
                  return {
                    name: columnAccessor,
                    filterValue
                  }
                }

                return fv
              })
            }
          }
    })
  }

  getRenderProps = () => {
    return {
      ...this.state,
      ...this.getComputedRows(),
      setHeaderData: this.setHeaderData,
      sorting: {
        ...this.state.sorting,
        handleSort: this.handleSort
      },
      filtering: {
        ...this.state.filtering,
        handleFilter: this.handleFilter
      },
      paging: {
        ...this.state.paging,
        ...this.getComputedPagingInfo(),
        handleNextPage: this.handleNextPage,
        handlePrevPage: this.handlePrevPage,
        handlePageChange: this.handlePageChange,
        handlePageChangeBlur: this.handlePageChangeBlur,
        handlePageSizeChange: this.handlePageSizeChange
      }
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
