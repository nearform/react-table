import React from 'react'

export class TableContainer extends React.Component {
  render() {
    return <div className="table">{this.props.children}</div>
  }
}

export class TableHeaderRow extends React.Component {
  state = {
    accessors: React.Children.map(this.props.children, child => {
      return child.props.accessor
    })
  }

  componentDidMount() {
    this.props.setAccessors(this.state.accessors)
  }

  render() {
    return <div className="tr th">{this.props.children}</div>
  }
}

export class TableHeader extends React.Component {
  render() {
    return <div className="td">{this.props.children}</div>
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
    return this.props.render({})
  }
}

export class Table extends React.Component {
  state = {
    accessors: this.props.accessors,
    data: this.props.data,
    filter: {
      isFiltered: false
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

  setAccessors = accessors => {
    this.setState(state => ({
      accessors
    }))
  }

  getComputedRows = () => {
    const {
      data,
      paging: { currentPage, pageSize },
      accessors
    } = this.state

    const start = (currentPage - 1) * pageSize
    const end = start + pageSize

    const rows = data.slice(start, end).map((row, index) => {
      return accessors.map(accessor => {
        return {
          id: row.id,
          row: index,
          accessor,
          data: row[accessor]
        }
      })
    })

    return {
      rows
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

  render() {
    return this.props.render({
      ...this.state,
      ...this.getComputedRows(),
      setAccessors: this.setAccessors,
      filter: {
        ...this.state.filter
        // handleFilterRow: this.handleFilterRow,
        // handleFilterColumn: this.handleFilterColumn
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
