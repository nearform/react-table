import React from 'react'
import ReactDOM from 'react-dom'
import {
  Table,
  TableContainer,
  TableHeaderRow,
  TableHeader,
  TableDataRow,
  TableFooter,
  TableFilterRow
} from '../../src'

const data = [
  {
    id: 1,
    name: 'John Smith',
    job: 'Developer',
    location: 'USA'
  },
  {
    id: 2,
    name: 'Jane Doe',
    job: 'Sales Manager',
    location: 'EU'
  },
  {
    id: 3,
    name: 'Robert Jones',
    job: 'Technical Manager',
    location: 'UK'
  },
  {
    id: 4,
    name: 'Angela Stoneworth',
    job: 'Sales Rep',
    location: 'UK'
  },
  {
    id: 5,
    name: 'Jack Fire',
    job: 'Developer',
    location: 'USA'
  },
  {
    id: 6,
    name: 'Donny Doe',
    job: 'Sales Manager',
    location: 'EU'
  },
  {
    id: 7,
    name: 'Ruby Reynolds',
    job: 'Technical Manager',
    location: 'UK'
  },
  {
    id: 8,
    name: 'Lenard Bonaparte',
    job: 'Sales Rep',
    location: 'EU'
  }
]

class Demo extends React.Component {
  render() {
    return (
      <Table
        data={data}
        pageSize={6}
        pageSizeOptions={[6, 12, 24, 48]}
        render={({
          columns,
          rows,
          setHeaderData,
          sorting,
          handleFilter,
          paging: {
            pageSizeOptions,
            totalNumberOfPages,
            hasPrevPage,
            hasNextPage,
            total,
            pageSize,
            currentPage,
            selectedPage,
            handleNextPage,
            handlePrevPage,
            handlePageChange,
            handlePageChangeBlur,
            handlePageSizeChange
          }
        }) => {
          return (
            <TableContainer>
              <TableHeaderRow>
                <TableHeader accessor="name" sortable filterable>
                  Name
                </TableHeader>
                <TableHeader accessor="job" sortable filterable>
                  Job
                </TableHeader>
                <TableHeader accessor="location" filterable>
                  Location
                </TableHeader>
              </TableHeaderRow>
              <TableFilterRow>
                {columns =>
                  columns.map((column, index) => {
                    return column.filterable ? (
                      <div className="filter" key={column.accessor}>
                        {column.accessor === 'location' ? (
                          <select
                            onChange={e => {
                              handleFilter(column.accessor, e.target.value)
                            }}
                          >
                            <option />
                            <option value="USA">USA</option>
                            <option value="EU">EU</option>
                            <option value="UK">UK</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            onChange={e => {
                              e.preventDefault()

                              handleFilter(column.accessor, e.target.value)
                            }}
                            style={{ width: '100%', padding: '7px' }}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="filter" />
                    )
                  })
                }
              </TableFilterRow>
              <TableDataRow
                render={rows =>
                  rows.map((row, index) => (
                    <div className="tr hover" key={index}>
                      {row &&
                        row.map(column => (
                          <div
                            key={`${column.id}-${column.accessor}`}
                            className="td"
                            style={{ justifyContent: 'center' }}
                          >
                            <span>
                              <a>{column.data}</a>
                            </span>
                          </div>
                        ))}
                    </div>
                  ))
                }
              />
              <TableFooter
                render={() => (
                  <div
                    className="footer"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5em 0'
                    }}
                  >
                    <button onClick={handlePrevPage} disabled={!hasPrevPage}>
                      Prev Page
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p style={{ marginRight: '1em' }}>Page</p>
                      <input
                        type="number"
                        min={1}
                        max={totalNumberOfPages}
                        onChange={handlePageChange}
                        onBlur={handlePageChangeBlur}
                        value={selectedPage}
                      />
                      <p> of {totalNumberOfPages}</p>
                    </div>

                    <div>
                      <select onChange={handlePageSizeChange} value={pageSize}>
                        {pageSizeOptions.map(pageSize => (
                          <option key={pageSize} value={pageSize}>
                            {pageSize} rows
                          </option>
                        ))}
                      </select>
                    </div>
                    <button onClick={handleNextPage} disabled={!hasNextPage}>
                      Next Page
                    </button>
                  </div>
                )}
              />
            </TableContainer>
          )
        }}
      />
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>,
  document.querySelector('#demo')
)
