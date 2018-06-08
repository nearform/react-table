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
        render={props => {
          return (
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <TableHeaderRow>
                  <TableHeader accessor="type" sortable filterable>
                    {({ isSorting, onClick }) => {
                      return (
                        <div
                          onClick={onClick}
                          style={{
                            padding: '1em',
                            background: '#2196F3',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
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
                                    borderLeft: '0.5em solid #d50000'
                                  }}
                                />
                              )}
                          </div>
                        </div>
                      )
                    }}
                  </TableHeader>
                  <TableHeader accessor="color" sortable filterable>
                    {({ isSorting, onClick }) => (
                      <div
                        onClick={onClick}
                        style={{
                          padding: '1em',
                          background: '#2196F3',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
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

                                  borderRight: '0.5em solid #d50000'
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
                      </div>
                    )}
                  </TableHeader>
                </TableHeaderRow>
              </div>
              <div
                style={{
                  flex: '1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: '#f5f5f5'
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
                    {row.rowData.map(column => (
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
          )
        }}
      />
    )
  }
}

export default HorizontalTable
