import React from 'react'
import { TableConsumer } from './TableContext'

export class TableHeaderRow extends React.Component {
  render() {
    const { className, children, style, component } = this.props
    return (
      <TableConsumer>
        {({ setHeaderData }) => (
          <React.Fragment>
            <HeaderData {...this.props} setHeaderData={setHeaderData} />
            {component ? (
              React.createElement(component, {
                ...this.props,
                className,
                style
              })
            ) : (
              <div style={style} className={className}>
                {children}
              </div>
            )}
          </React.Fragment>
        )}
      </TableConsumer>
    )
  }
}

export class HeaderData extends React.Component {
  state = {
    columns: React.Children.map(this.props.children, ({ props }) => ({
      accessor: props.accessor,
      label: props.children,
      sortable: props.sortable || false,
      filterable: props.filterable || false
    })),
    shouldUpdateParent: true
  }

  setParentData = () => {
    const { setHeaderData } = this.props
    // TODO: warn when setHeaderData is null/undefined, not a nested cmp

    this.setState(
      { shouldUpdateParent: false },
      setHeaderData({ columns: this.state.columns })
    )
  }

  componentDidMount() {
    this.state.shouldUpdateParent && this.setParentData()
  }

  componentDidUpdate() {
    this.state.shouldUpdateParent && this.setParentData()
  }

  render() {
    return null
  }
}
