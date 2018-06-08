import React from 'react'
import { Table, TableHeaderRow, TableHeader } from '../../src'

const data = [
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

const MyUserTable = () => {
  return (
    <Table
      data={data}
      render={({ rows }) => {
        return (
          <table>
            <thead>
              <tr>
                <TableHeaderRow>
                  <TableHeader accessor="name">
                    <th>Name</th>
                  </TableHeader>
                  <TableHeader accessor="calories">
                    <th>Calories</th>
                  </TableHeader>
                  <TableHeader accessor="fat">
                    <th>Fat</th>
                  </TableHeader>
                  <TableHeader accessor="carbs">
                    <th>Carbs</th>
                  </TableHeader>
                  <TableHeader accessor="protein">
                    <th>Protein</th>
                  </TableHeader>
                </TableHeaderRow>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ rowKey, rowData }) => {
                return (
                  <tr key={rowKey}>
                    {rowData.map(({ accessor, data, key }) => {
                      return <td key={key}>{data}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )
      }}
    />
  )
}

export default MyUserTable
