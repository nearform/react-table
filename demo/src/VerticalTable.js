import React from 'react'
import { Table, TableHeaderRow, TableHeader } from '../../src'

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

class VerticalTable extends React.Component {
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
          totalNumberOfPages,
          hasPrevPage,
          hasNextPage,
          pageSizeOptions,
          total,
          pageSize,
          currentPage,
          selectedPage,
          handleNextPage,
          handlePrevPage,
          handlePageChange,
          handlePageChangeBlur,
          handlePageSizeChange
        }) => {
          return (
            <div className="table">
              <TableHeaderRow className="tr th">
                <TableHeader className="td" accessor="name" sortable filterable>
                  Name
                </TableHeader>
                <TableHeader className="td" accessor="job" sortable filterable>
                  Job
                </TableHeader>
                <TableHeader className="td" accessor="location" filterable>
                  Location
                </TableHeader>
              </TableHeaderRow>
              <div className="tr">
                {columns.map(
                  (column, index) =>
                    column.filterable ? (
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
                )}
              </div>
              <div>
                {rows.map((row, index) => (
                  <div className="tr hover" key={index}>
                    {row &&
                      row.rowData.map(column => (
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
                ))}
              </div>

              <footer
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
              </footer>
            </div>
          )
        }}
      />
    )
  }
}

export default VerticalTable
