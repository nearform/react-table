var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _class, _temp2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import orderBy from 'lodash.orderby';
import conforms from 'lodash.conforms';
import { TableProvider } from './TableContext';

export var Table = (_temp2 = _class = function (_React$Component) {
  _inherits(Table, _React$Component);

  function Table() {
    var _temp, _this, _ret;

    _classCallCheck(this, Table);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      columns: _this.props.columns,
      data: _this.props.data.map(function (d) {
        return _extends({}, d, { _table_id: shortid.generate() });
      }),
      _data: _this.props.data,
      total: _this.props.data.length,
      pageSize: _this.props.pageSize,
      currentPage: _this.props.currentPage,
      selectedPage: _this.props.currentPage,
      pageSizeOptions: _this.props.pageSizeOptions,
      sorting: _this.props.sorting,
      filtering: _this.props.filtering,
      selecting: _this.props.selecting,
      totalNumberOfPages: 0
    }, _this.setTableState = function (state, cb) {
      return _this.setState(state, cb);
    }, _this.setHeaderData = function () {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$columns = _ref.columns,
          columns = _ref$columns === undefined ? [] : _ref$columns;

      if (Boolean(columns) && Array.isArray(columns)) {
        _this.setState({ columns: columns });
      }
    }, _this.handlePrevPage = function (e) {
      e && e.preventDefault();

      _this.setState(function (state) {
        if (state.currentPage > 1) {
          var currentPage = state.currentPage - 1;

          return {
            selectedPage: currentPage,
            currentPage: currentPage
          };
        }
      });
    }, _this.handleNextPage = function (e) {
      e && e.preventDefault();

      _this.setState(function (state) {
        var total = state.total,
            pageSize = state.pageSize,
            currentPage = state.currentPage;

        var hasNextPage = currentPage < Math.ceil(total / pageSize);

        if (hasNextPage) {
          var _currentPage = state.currentPage + 1;

          return {
            selectedPage: _currentPage,
            currentPage: _currentPage
          };
        }
      });
    }, _this.handlePageChange = function (e) {
      e && e.preventDefault();

      var inputValue = Number(e.target.value);

      _this.setState(function (state) {
        return {
          selectedPage: inputValue
        };
      });
    }, _this.handlePageChangeBlur = function (e) {
      e && e.preventDefault();

      var inputValue = Number(e.target.value);
      var _this$state = _this.state,
          total = _this$state.total,
          pageSize = _this$state.pageSize;


      var isValidValue = inputValue !== '' && Number.isInteger(inputValue) && inputValue > 0 && inputValue <= Math.ceil(total / pageSize);

      if (isValidValue) {
        return _this.setState(function (state) {
          return {
            selectedPage: inputValue,
            currentPage: inputValue
          };
        });
      }

      return _this.setState(function (state) {
        return {
          selectedPage: state.currentPage,
          currentPage: state.currentPage
        };
      });
    }, _this.handlePageSizeChange = function (e) {
      e && e.preventDefault();

      var pageSize = Number(e.target.value);

      _this.setState(function (state) {
        return {
          pageSize: pageSize,
          currentPage: 1,
          selectedPage: 1
        };
      });
    }, _this.handleSort = function (columnAccessor, multipleSelect) {
      return _this.setState(function (state) {
        var sorting = state.sorting;


        var sortedColumn = sorting.find(function (sort) {
          return sort.id === columnAccessor;
        });

        return {
          sorting: [].concat(Boolean(multipleSelect) ? sorting.filter(function (_ref2) {
            var id = _ref2.id;
            return id !== columnAccessor;
          }) : [], [Boolean(sortedColumn) ? _extends({}, sortedColumn, { asc: !sortedColumn.asc }) : { id: columnAccessor, asc: true }])
        };
      });
    }, _this.handleFilter = function (columnAccessor, value) {
      _this.setState(function (state) {
        var filtering = state.filtering;


        var filteredColumn = filtering.find(function (_ref3) {
          var id = _ref3.id;
          return id === columnAccessor;
        });

        return {
          filtering: [].concat(filtering.filter(function (_ref4) {
            var id = _ref4.id;
            return id !== columnAccessor;
          }), [filteredColumn ? _extends({}, filteredColumn, { value: value }) : { id: columnAccessor, value: value }])
        };
      });
    }, _this.handleRowSelect = function (rowKey) {
      _this.setState(function (_ref5) {
        var selecting = _ref5.selecting;

        if (rowKey === 'all' && selecting[0] !== 'all') {
          return {
            selecting: ['all']
          };
        }

        if (selecting[0] === 'all') {
          return {
            selecting: []
          };
        }

        var existingValue = selecting.find(function (s) {
          return s === rowKey;
        });

        if (typeof existingValue === 'undefined') {
          return {
            selecting: [].concat(selecting, [rowKey])
          };
        }

        return {
          selecting: selecting.filter(function (s) {
            return s !== rowKey;
          })
        };
      });
    }, _this.handleAddRow = function (item) {
      _this.setState({
        data: [].concat(_this.props.data, [item]).map(function (d) {
          return _extends({}, d, {
            _table_id: shortid.generate()
          });
        })
      });
    }, _this.handleDeleteRow = function (rowKey) {
      _this.setState(function (state) {
        return {
          data: state.data.filter(function (d) {
            return d._table_id !== rowKey;
          }),
          total: state.total > 1 ? Number(state.total) - 1 : 0
        };
      });
    }, _this.handleDeleteAllSelecting = function () {
      if (_this.state.selecting[0] === 'all') {
        _this.state.data.forEach(function (d) {
          return _this.handleDeleteRow(d._table_id);
        });
      }
      _this.state.selecting.forEach(function (selected) {
        return _this.handleDeleteRow(selected);
      });
      _this.setState(function (state) {
        return {
          selecting: []
        };
      });
    }, _this.handleEditRow = function (rowKey, updatedItem) {
      _this.setState(function (state) {
        return {
          data: state.data.map(function (d) {
            return d._table_id === rowKey ? _extends({}, updatedItem, {
              _table_id: shortid.generate()
            }) : d;
          })
        };
      });
    }, _this.handleEditColumn = function (rowKey, accessor, updatedItem) {
      _this.setState(function (state) {
        return {
          data: _this.state.data.map(function (d) {
            if (d._table_id === rowKey) {
              var _extends2;

              return _extends({}, d, (_extends2 = {
                _table_id: shortid.generate()
              }, _extends2[accessor] = updatedItem, _extends2));
            }

            return d;
          })
        };
      });
    }, _this.getComputedProps = function () {
      var _this$state2 = _this.state,
          columns = _this$state2.columns,
          data = _this$state2.data,
          currentPage = _this$state2.currentPage,
          pageSize = _this$state2.pageSize,
          sorting = _this$state2.sorting,
          filtering = _this$state2.filtering,
          selecting = _this$state2.selecting;


      if (!columns.length) return { rows: [] };

      var start = (currentPage - 1) * pageSize;
      var end = start + pageSize;

      var iteratees = sorting.map(function (_ref6) {
        var id = _ref6.id;
        return id;
      });
      var orders = sorting.map(function (_ref7) {
        var asc = _ref7.asc;
        return asc ? 'asc' : 'desc';
      });

      var filterPredicate = filtering.reduce(function (accum, _ref8) {
        var id = _ref8.id,
            value = _ref8.value;

        accum[id] = function (n) {
          return n.toLowerCase().includes(value.toLowerCase());
        };

        return accum;
      }, {});

      var orderedRows = orderBy(data, iteratees, orders);
      var filteredRows = orderedRows.filter(conforms(filterPredicate));

      var rows = filteredRows.slice(start, end).map(function (row, rowIndex) {
        return {
          selected: selecting[0] === 'all' || typeof selecting.find(function (s) {
            return s === row._table_id;
          }) !== 'undefined',
          rowKey: row._table_id,
          rowData: columns.map(function (_ref9, columnIndex) {
            var accessor = _ref9.accessor;

            return accessor ? {
              key: row._table_id + '-' + rowIndex + '-' + columnIndex,
              type: 'data-row',
              accessor: accessor,
              data: row[accessor]
            } : {
              type: 'empty-row',
              key: row._table_id + '-empty-' + rowIndex + '-' + columnIndex
            };
          })
        };
      });

      var totalNumberOfPages = Math.ceil(filteredRows.length / pageSize);

      return {
        rows: rows,
        totalNumberOfPages: totalNumberOfPages,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage !== totalNumberOfPages && filteredRows.length > 0
      };
    }, _this.getActions = function () {
      return {
        setTableState: _this.setTableState,
        setHeaderData: _this.setHeaderData,
        handleSort: _this.handleSort,
        handleFilter: _this.handleFilter,
        handleNextPage: _this.handleNextPage,
        handlePrevPage: _this.handlePrevPage,
        handlePageChange: _this.handlePageChange,
        handlePageChangeBlur: _this.handlePageChangeBlur,
        handlePageSizeChange: _this.handlePageSizeChange,
        handleRowSelect: _this.handleRowSelect,
        handleAddRow: _this.handleAddRow,
        handleDeleteRow: _this.handleDeleteRow,
        handleEditRow: _this.handleEditRow,
        handleEditColumn: _this.handleEditColumn,
        handleDeleteAllSelecting: _this.handleDeleteAllSelecting
      };
    }, _this.getRenderProps = function () {
      return _extends({}, _this.state, _this.getComputedProps(), _this.getActions());
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Table.prototype.render = function render() {
    var _props = this.props,
        component = _props.component,
        render = _props.render,
        children = _props.children;

    var props = this.getRenderProps();

    return React.createElement(
      TableProvider,
      { value: props },
      component ? React.createElement(component, props) : render ? render(props) : typeof children === 'function' ? children(props) : !(React.Children.count(children) === 0) ? React.Children.only(children) : null
    );
  };

  return Table;
}(React.Component), _class.defaultProps = {
  columns: [],
  data: [],
  currentPage: 1,
  pageSize: 8,
  pageSizeOptions: [8, 16, 24, 48],
  sorting: [],
  filtering: [],
  selecting: []
}, _temp2);
Table.propTypes = process.env.NODE_ENV !== "production" ? {
  columns: PropTypes.arrayOf(PropTypes.shape({
    accessor: PropTypes.string
  })),
  data: PropTypes.array,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  sorting: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    asc: PropTypes.bool
  })),
  filtering: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.any
  })),
  selecting: PropTypes.arrayOf(PropTypes.string)
} : {};