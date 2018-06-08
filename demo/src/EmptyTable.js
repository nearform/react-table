import React from 'react'
import { Table, TableHeaderRow, TableHeader } from '../../src'

class EmptyTable extends React.Component {
  render() {
    return (
      <Table
        render={({ rows }) => (
          <div>
            <TableHeaderRow>
              <div className="tr th">
                <TableHeader accessor="name" sortable filterable>
                  <div className="td">Name</div>
                </TableHeader>
                <TableHeader accessor="job" sortable filterable>
                  <div className="td">Job</div>
                </TableHeader>
                <TableHeader accessor="location" filterable>
                  <div className="td">Location</div>
                </TableHeader>
              </div>
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
