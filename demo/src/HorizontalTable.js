import React from 'react'
import { Table, TableHeaderRow, TableHeader } from '../../src'

const data = [
  { id: 1, type: 'truck', color: 'blue' },
  { id: 2, type: 'car', color: 'red' },
  { id: 3, type: 'car', color: 'tan' },
  { id: 4, type: 'car', color: 'blue' },
  { id: 5, type: 'car', color: 'orange' }
]

class HorizontalTable extends React.Component {
  render() {
    return (
      <Table
        data={data}
        render={props => (
          <div style={{ display: 'flex' }}>
            <TableHeaderRow
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <TableHeader
                style={{
                  padding: '1em',
                  background: 'dodgerblue',
                  color: 'white'
                }}
                accessor="type"
                sortable
                filterable
              >
                {({ isSorting }) => (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    {isSorting &&
                      !isSorting.asc && (
                        <span
                          style={{
                            width: 0,
                            height: 0,
                            borderTop: '0.5em solid transparent',
                            borderBottom: '0.5em solid transparent',

                            borderRight: '0.5em solid red'
                          }}
                        />
                      )}
                    <span
                      style={{
                        userSelect: 'none',
                        fontWeight: 700,
                        padding: '0 0.5em'
                      }}
                    >
                      Type
                    </span>
                    {isSorting &&
                      isSorting.asc && (
                        <span
                          style={{
                            width: 0,
                            height: 0,
                            borderTop: '0.5em solid transparent',
                            borderBottom: '0.5em solid transparent',
                            borderLeft: '0.5em solid red'
                          }}
                        />
                      )}
                  </div>
                )}
              </TableHeader>
              <TableHeader
                style={{
                  padding: '1em',
                  background: 'dodgerblue',
                  color: 'white'
                }}
                accessor="color"
                sortable
                filterable
              >
                {({ isSorting }) => (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    {isSorting &&
                      !isSorting.asc && (
                        <span
                          style={{
                            width: 0,
                            height: 0,
                            borderTop: '0.5em solid transparent',
                            borderBottom: '0.5em solid transparent',

                            borderRight: '0.5em solid red'
                          }}
                        />
                      )}
                    <span
                      style={{
                        userSelect: 'none',
                        fontWeight: 700,
                        padding: '0 0.5em'
                      }}
                    >
                      Color
                    </span>
                    {isSorting &&
                      isSorting.asc && (
                        <span
                          style={{
                            width: 0,
                            height: 0,
                            borderTop: '0.5em solid transparent',
                            borderBottom: '0.5em solid transparent',
                            borderLeft: '0.5em solid red'
                          }}
                        />
                      )}
                  </div>
                )}
              </TableHeader>
            </TableHeaderRow>
            <div
              style={{
                flex: '1',
                display: 'flex',
                justifyContent: 'space-between',
                background: '#eee'
              }}
            >
              {props.rows.map((row, index) => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRight: '0'
                  }}
                  className="hover"
                  key={index}
                >
                  {row.map(column => (
                    <div
                      style={{ padding: '1em' }}
                      key={`${column.id}-${column.accessor}`}
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

export default HorizontalTable
