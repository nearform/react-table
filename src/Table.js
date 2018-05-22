import React from 'react'
import _ from 'lodash'

export class TableContainer extends React.Component {
  render() {
    return <div className="table">{this.props.children}</div>
  }
}

export class TableHeaderRow extends React.Component {
  state = {
    accessors: [],
    sort: [],
    shouldUpdateParent: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.accessors.length) {
      console.log('calculating new getDerivedStateFromProps')
      const computedState = {
        shouldUpdateParent: true,
        accessors: React.Children.map(
          nextProps.children,
          child => child.props.accessor
        ),
        sort: React.Children.map(
          nextProps.children,
          child => child.props.sort || false
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
        this.props.setHeaderData({
          accessors: this.state.accessors,
          sort: this.state.sort
        })
      )
    }
  }

  render() {
    return <div className="tr th">{this.props.children}</div>
  }
}

export class TableHeader extends React.Component {
  render() {
    const {
      sorting: { sortables, orders },
      accessor
    } = this.props
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

          return this.props.sorting.handleSort(accessor, isMultipleSelect)
        }}
      >
        {this.props.children}
      </div>
    )
  }
}

export class TableDataRow extends React.Component {
  render() {
    return this.props.render(this.props.rows)
  }
}

export class TableRow extends React.Component {
  render() {
    return <div className="tr">{this.props.render(this.props.row)}</div>
  }
}

export class TableFooter extends React.Component {
  render() {
    return this.props.render()
  }
}

export class Table extends React.Component {
  state = {
    accessors: this.props.accessors,
    data: this.props.data,
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
    accessors: [],
    data: [],
    currentPage: 1,
    pageSize: 8,
    pageSizeOptions: [8, 16, 24, 48]
  }

  setHeaderData = ({ accessors, sort }) => {
    this.setState(state => ({
      accessors,
      sorting: {
        ...state.sorting,
        noSort: accessors.filter((accessor, index) => !sort[index])
      }
    }))
  }

  getComputedRows = () => {
    const {
      data,
      accessors,
      paging: { currentPage, pageSize },
      sorting: { orders, sortables }
    } = this.state

    const start = (currentPage - 1) * pageSize
    const end = start + pageSize

    return {
      rows: _.orderBy(data, sortables, orders)
        .slice(start, end)
        .map((row, index) => {
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

  render() {
    return this.props.render({
      ...this.state,
      ...this.getComputedRows(),
      setHeaderData: this.setHeaderData,
      sorting: {
        ...this.state.sorting,
        handleSort: this.handleSort
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
    })
  }
}
