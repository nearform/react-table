import React from 'react'
import ReactDOM from 'react-dom'

import VerticalTable from './VerticalTable'
import HorizontalTable from './HorizontalTable'
import EmptyTable from './EmptyTable'
import MaterialTable from './MaterialTable'

import './Table.css'

class Demo extends React.Component {
  state = {
    showing: ''
  }

  render() {
    return (
      <div style={{ margin: '0.5em' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around'
          }}
        >
          <button onClick={e => this.setState({ showing: 'vertical' })}>
            Show Vertical
          </button>
          <button onClick={e => this.setState({ showing: 'horizontal' })}>
            Show Horizontal
          </button>
          <button onClick={e => this.setState({ showing: 'empty' })}>
            Show Empty
          </button>
          <button onClick={e => this.setState({ showing: 'material' })}>
            Show Material Table
          </button>
        </div>
        {this.state.showing === 'vertical' && (
          <div>
            <h1>Vertical Table</h1>
            <VerticalTable />
          </div>
        )}
        {this.state.showing === 'horizontal' && (
          <div>
            <h1>Horizontal Table</h1>
            <HorizontalTable />
          </div>
        )}
        {this.state.showing === 'empty' && (
          <div>
            <h1>Empty Table</h1>
            <EmptyTable />
          </div>
        )}

        {this.state.showing === 'material' && <MaterialTable />}
      </div>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>,
  document.querySelector('#demo')
)
