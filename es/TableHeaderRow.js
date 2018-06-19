var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import { TableConsumer } from './TableContext';

export var TableHeaderRow = function (_React$Component) {
  _inherits(TableHeaderRow, _React$Component);

  function TableHeaderRow() {
    _classCallCheck(this, TableHeaderRow);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  TableHeaderRow.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props,
        children = _props.children,
        component = _props.component;

    return React.createElement(
      TableConsumer,
      null,
      function (tableProps) {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement(HeaderData, _extends({}, _this2.props, {
            setHeaderData: tableProps ? tableProps.setHeaderData : null
          })),
          component ? React.createElement(component, _this2.props) : children
        );
      }
    );
  };

  return TableHeaderRow;
}(React.Component);

TableHeaderRow.propTypes = process.env.NODE_ENV !== "production" ? {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.func])), PropTypes.element]),
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.string])
} : {};
export var HeaderData = function (_React$Component2) {
  _inherits(HeaderData, _React$Component2);

  function HeaderData() {
    var _temp, _this3, _ret;

    _classCallCheck(this, HeaderData);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this3 = _possibleConstructorReturn(this, _React$Component2.call.apply(_React$Component2, [this].concat(args))), _this3), _this3.state = {
      columns: React.Children.map(_this3.props.children, function (_ref) {
        var props = _ref.props;
        return {
          accessor: props.accessor || false,
          label: props.children,
          sortable: props.sortable || false,
          filterable: props.filterable || false
        };
      }) || [],
      shouldUpdateParent: true
    }, _this3.setParentData = function () {
      var setHeaderData = _this3.props.setHeaderData;
      // TODO: warn when setHeaderData is null/undefined, not a nested cmp

      _this3.setState({ shouldUpdateParent: false }, function () {
        return setHeaderData && setHeaderData({ columns: _this3.state.columns });
      });
    }, _temp), _possibleConstructorReturn(_this3, _ret);
  }

  HeaderData.prototype.componentDidMount = function componentDidMount() {
    this.state.shouldUpdateParent && this.setParentData();
  };

  HeaderData.prototype.render = function render() {
    return null;
  };

  return HeaderData;
}(React.Component);