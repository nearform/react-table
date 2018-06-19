var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import { TableConsumer } from './TableContext';

export var TableHeader = function (_React$Component) {
  _inherits(TableHeader, _React$Component);

  function TableHeader() {
    _classCallCheck(this, TableHeader);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  TableHeader.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        render = _props.render,
        component = _props.component,
        children = _props.children;


    return React.createElement(
      TableConsumer,
      null,
      function () {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$columns = _ref.columns,
            columns = _ref$columns === undefined ? [] : _ref$columns,
            _ref$sorting = _ref.sorting,
            sorting = _ref$sorting === undefined ? [] : _ref$sorting,
            handleSort = _ref.handleSort;

        var _props2 = _this2.props,
            accessor = _props2.accessor,
            _props2$filterable = _props2.filterable,
            filterable = _props2$filterable === undefined ? false : _props2$filterable,
            _props2$sortable = _props2.sortable,
            sortable = _props2$sortable === undefined ? false : _props2$sortable;

        var isSorting = sorting.find(function (column) {
          return column.id === accessor;
        });
        var returnProps = _extends(_extends({}, _this2.props, { sortable: null, filterable: null }), sortable && typeof component !== 'string' ? {
          isSorting: isSorting,
          sortable: sortable,
          filterable: filterable,
          onClick: function onClick(e) {
            var isMultipleSelect = e.shiftKey;
            return handleSort(accessor, isMultipleSelect);
          }
        } : {}, sortable && typeof component === 'string' && isSorting && {
          issorting: isSorting.asc ? 'asc' : 'desc'
        }, sortable && typeof component === 'string' && {
          onClick: function onClick(e) {
            var isMultipleSelect = e.shiftKey;
            return handleSort(accessor, isMultipleSelect);
          }
        });

        return component ? React.createElement(component, returnProps, children) : render ? render(returnProps) : typeof children === 'function' ? children(returnProps) : children;
      }
    );
  };

  return TableHeader;
}(React.Component);
TableHeader.propTypes = process.env.NODE_ENV !== "production" ? {
  render: PropTypes.func,
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.string]),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.string, PropTypes.number])
} : {};