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
          accessors,
          setHeaderData,
          sorting,
          filtering: { handleFilter },
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
                <TableHeader accessor="name" sort filter>
                  Name
                </TableHeader>
                <TableHeader accessor="job" sort>
                  Job
                </TableHeader>
                <TableHeader accessor="location">Location</TableHeader>
              </TableHeaderRow>
              <TableFilterRow>
                {columns.map((column, index) => {
                  return (
                    <div className="filter" key={column}>
                      {column === 'location' ? (
                        <select
                          style={{ width: '100%', height: '100%' }}
                          onChange={e => {
                            handleFilter(column, e.target.value)
                          }}
                        >
                          <option>{`-- Filter by ${column} --`}</option>
                          <option>USA</option>
                          <option>EU</option>
                          <option>UK</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          onChange={e => {
                            e.preventDefault()

                            handleFilter(column, e.target.value)
                          }}
                          placeholder={`Filter for ${column}`}
                          style={{ width: '100%', padding: '7px' }}
                        />
                      )}
                    </div>
                  )
                })}
              </TableFilterRow>
              <TableDataRow
                render={rows =>
                  rows.map((row, index) => (
                    <div className="tr" key={index}>
                      {row.map(column => (
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
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
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
