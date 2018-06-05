import React from 'react'
import { Table, TableHeaderRow, TableHeader } from '../../src'
import DeleteIcon from './baseline-delete-24px.svg'
import UpArrow from './baseline-arrow_upward-24px.svg'
import DownArrow from './baseline-arrow_downward-24px.svg'
import ForwardArrow from './baseline-arrow_forward_ios-24px.svg'
import BackArrow from './baseline-arrow_back_ios-24px.svg'
import DropDown from './baseline-arrow_drop_down-24px.svg'

const desserts = [
  {
    name: 'Frozen yogurt',
    calories: 159,
    fat: 6,
    carbs: 24,
    protein: 4
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9,
    carbs: 37,
    protein: 4.3
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16,
    carbs: 24,
    protein: 6.0
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 3.9
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16,
    carbs: 49,
    protein: 0.0
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0,
    carbs: 94,
    protein: 0
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 6.5
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 4.9
  }
]

function HorizontalDiv({ children }) {
  return (
    <thead style={{ display: 'table-header-group' }}>
      <tr>{children}</tr>
    </thead>
  )
}

function HeaderComponent({ onClick, isSorting, children }) {
  return (
    <th
      onClick={onClick}
      style={{
        userSelect: 'none',
        color: `${isSorting ? '#000' : 'rgba(0, 0, 0, 0.54)'}`,
        fontWeight: 500,
        fontSize: '0.75rem',
        display: 'table-cell',
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        padding: '2em 0.25em 1em'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isSorting ? (
            isSorting.asc ? (
              <img
                style={{
                  position: 'absolute',
                  left: '-2em',
                  width: '1.5em'
                }}
                src={DownArrow}
                alt="down-arrow"
              />
            ) : (
              <img
                style={{
                  position: 'absolute',
                  left: '-2em',
                  width: '1.5em'
                }}
                src={UpArrow}
                alt="up-arrow"
              />
            )
          ) : null}
          {children}
        </div>
      </div>
    </th>
  )
}

class PageSizeChooser extends React.Component {
  state = {
    open: false,
    pageSizeOptions: this.props.pageSizeOptions
  }

  static defaultProps = {
    pageSizeOptions: []
  }

  render() {
    const { open, pageSizeOptions } = this.state
    const { pageSize, handlePageSizeChange } = this.props

    return (
      <div
        style={{ position: 'relative', outline: 'none' }}
        tabIndex={open ? '0' : '-1'}
        onBlur={e => this.setState(state => ({ open: false }))}
      >
        <div
          style={{
            display: 'flex',
            opacity: `${open ? '1' : '0'}`,
            visibility: `${open ? 'visible' : 'hidden'}`,
            animiation: 'fadeIn 200ms',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'absolute',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid transparent',
            top: `-${pageSizeOptions.length * 2 + 1}rem`,
            left: '-2rem',
            minWidth: '7rem',
            background: '#fff',
            zIndex: 2,
            borderRadius: '0.5em',
            padding: 'calc(0.5rem - 1px) 0px',
            boxShadow:
              ' 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            transition:
              'opacity 300ms cubic-bezier(0.600, -0.030, 0.340, 0.895)'
          }}
        >
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}
          >
            {pageSizeOptions.map(option => (
              <li key={option} className="menu-li">
                <button
                  value={option}
                  className={`${pageSize === option ? 'selected' : ''}`}
                  onMouseDown={e =>
                    this.setState(
                      state => ({ open: false }),
                      handlePageSizeChange(e)
                    )
                  }
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={e => this.setState(state => ({ open: true }))}
          className="menu-dropdown"
          type="button"
        >
          <span style={{ padding: '0 0 0 0.75em', lineHeight: '24px' }}>
            {pageSize}
          </span>

          <img src={DropDown} alt="drop-down" />
        </button>
      </div>
    )
  }
}

function CheckBox({ checked }) {
  return (
    <React.Fragment>
      <input
        type="checkbox"
        style={{
          position: 'absolute',
          opacity: 0,
          pointerEvents: 'none'
        }}
        onChange={() => ({})}
        checked={checked ? 'checked' : ''}
      />
      <span />
    </React.Fragment>
  )
}

function TableBody({ component, children }) {
  return React.createElement(component, { children })
}

function TableRow(props) {
  const { component, children, style, className } = props

  return React.createElement(component, {
    ...props,
    component: null,
    children,
    style,
    className
  })
}

function TableData({ component, children, style, className }) {
  return React.createElement(component, { children, style, className })
}

class MaterialTable extends React.Component {
  render() {
    return (
      <div
        style={{ marginTop: '4em', display: 'flex', justifyContent: 'center' }}
      >
        <div
          style={{ background: '#eee', padding: '3em 2em', minWidth: '80vw' }}
        >
          <Table
            pageSize={5}
            pageSizeOptions={[5, 10, 20, 50]}
            data={desserts}
            render={({
              rows,
              setHeaderData,
              handleRowSelect,
              selecting,
              pageSize,
              pageSizeOptions,
              total,
              currentPage,
              hasNextPage,
              hasPrevPage,
              handlePrevPage,
              handleNextPage,
              handlePageSizeChange
            }) => {
              return (
                <React.Fragment>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      color:
                        selecting.length > 0
                          ? '#673ab7'
                          : 'rgba(0, 0, 0, 0.87)',
                      background: selecting.length > 0 ? '#e8eaf6' : '#fff',
                      margin: 0,
                      padding: '1em 1em 0.5em 1em'
                    }}
                  >
                    <h2 style={{ color: '#000' }}>Material Table</h2>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {selecting.length > 0 && (
                        <React.Fragment>
                          <p style={{ fontSize: '0.875rem', margin: '0 2em' }}>
                            <span>Number of rows selected: </span>
                            <span style={{ fontWeight: 'bold' }}>
                              {selecting[0] === 'all'
                                ? rows.length
                                : selecting.length}
                            </span>
                          </p>
                          <div
                            style={{
                              position: 'relative',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center'
                            }}
                          >
                            <button
                              type="button"
                              className="ripple-button"
                              onClick={e => {
                                console.log('caught delete click')
                              }}
                            >
                              <img src={DeleteIcon} alt="delete-button" />
                            </button>
                            <span className="tooltip">Delete Rows</span>
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                  <div>
                    <table
                      style={{
                        width: '100%',
                        background: '#fff',
                        borderSpacing: 0,
                        borderCollapse: 'collapse'
                      }}
                    >
                      <TableHeaderRow component={HorizontalDiv}>
                        <HeaderComponent
                          onClick={e => {
                            handleRowSelect('all')
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <CheckBox checked={selecting[0] === 'all'} />
                        </HeaderComponent>
                        <TableHeader
                          accessor="name"
                          component={HeaderComponent}
                          sortable
                        >
                          Dessert (100g serving)
                        </TableHeader>
                        <TableHeader
                          accessor="calories"
                          component={HeaderComponent}
                          sortable
                        >
                          Calories
                        </TableHeader>
                        <TableHeader
                          accessor="fat"
                          component={HeaderComponent}
                          sortable
                        >
                          Fat (g)
                        </TableHeader>
                        <TableHeader
                          accessor="carbs"
                          component={HeaderComponent}
                          sortable
                        >
                          Carbs (g)
                        </TableHeader>
                        <TableHeader
                          accessor="protein"
                          component={HeaderComponent}
                          sortable
                        >
                          Protein (g)
                        </TableHeader>
                      </TableHeaderRow>
                      <TableBody
                        component="tbody"
                        style={{ display: 'table-row-group' }}
                      >
                        {rows.map(({ rowKey, rowData, selected }, index) => (
                          <TableRow
                            component="tr"
                            className="hover-tr"
                            key={rowKey}
                            style={{
                              color: 'inherit',
                              height: '3em',
                              display: 'table-row',
                              outline: 'none',
                              verticalAlign: 'middle',
                              backgroundColor: selected ? '#E8EAF6' : ''
                            }}
                            onClick={e => {
                              handleRowSelect(rowKey)
                            }}
                          >
                            {rowData.map(({ accessor, data, key }) => (
                              <TableData
                                component="td"
                                key={key}
                                style={{
                                  color: 'rgba(0, 0, 0, 0.87)',
                                  fontSize: '0.8rem',
                                  fontWeight: 400,
                                  display: 'table-cell',
                                  padding: '1em',
                                  textAlign: 'center',
                                  borderBottom:
                                    '1px solid rgba(224, 224, 224, 1)',
                                  verticalAlign: 'inherit'
                                }}
                              >
                                {accessor ? (
                                  data
                                ) : (
                                  <CheckBox checked={selected} />
                                )}
                              </TableData>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </table>
                    <footer
                      style={{
                        background: '#fff',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        color: '#0000008a',
                        padding: '2em 1em'
                      }}
                    >
                      <span style={{ margin: '0 2em' }}>Rows per page:</span>
                      <PageSizeChooser
                        pageSize={pageSize}
                        pageSizeOptions={pageSizeOptions}
                        handlePageSizeChange={handlePageSizeChange}
                      />

                      <span style={{ margin: '0 2em' }}>
                        {currentPage * pageSize - pageSize + 1}-
                        {currentPage * pageSize > total
                          ? total
                          : currentPage * pageSize}{' '}
                        of {total}
                      </span>
                      <button
                        style={{
                          margin: '0 2em',
                          opacity: `${hasPrevPage ? '1' : '0.25'}`,
                          cursor: `${hasPrevPage ? 'pointer' : 'not-allowed'}`,
                          border: 'none',
                          background: 'inherit',
                          borderRadius: 'initial',
                          padding: 'initial',
                          outline: 'none'
                        }}
                        onClick={e => handlePrevPage(e)}
                      >
                        <img
                          src={BackArrow}
                          alt="back-arrow"
                          style={{ width: '1.5em' }}
                        />
                      </button>
                      <button
                        style={{
                          opacity: `${hasNextPage ? '1' : '0.25'}`,
                          cursor: `${hasNextPage ? 'pointer' : 'not-allowed'}`,
                          border: 'none',
                          background: 'inherit',
                          borderRadius: 'initial',
                          padding: 'initial',
                          outline: 'none'
                        }}
                        onClick={e => handleNextPage(e)}
                      >
                        <img
                          src={ForwardArrow}
                          alt="forward-arrow"
                          style={{ width: '1.5em' }}
                        />
                      </button>
                    </footer>
                  </div>
                </React.Fragment>
              )
            }}
          />
        </div>
      </div>
    )
  }
}

export default MaterialTable
