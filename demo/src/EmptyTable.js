import React from 'react'
import { Table, TableHeaderRow, TableHeader } from '../../src'

class EmptyTable extends React.Component {
  render() {
    return (
      <Table
        render={({ rows }) => (
          <div>
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
            <div>
              {!rows.length && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    border: '1px solid #ccc'
                  }}
                >
                  <h1 style={{ color: '#ccc' }}>No data to display</h1>
                </div>
              )}
              {rows.map((row, index) => (
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
              ))}
            </div>
          </div>
        )}
      />
    )
  }
}

export default EmptyTable
