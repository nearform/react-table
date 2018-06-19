'use strict';

exports.__esModule = true;
exports.HeaderData = exports.TableHeaderRow = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TableContext = require('./TableContext');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TableHeaderRow = exports.TableHeaderRow = function (_React$Component) {
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

    return _react2.default.createElement(
      _TableContext.TableConsumer,
      null,
      function (tableProps) {
        return _react2.default.createElement(
          _react2.default.Fragment,
          null,
          _react2.default.createElement(HeaderData, _extends({}, _this2.props, {
            setHeaderData: tableProps ? tableProps.setHeaderData : null
          })),
          component ? _react2.default.createElement(component, _this2.props) : children
        );
      }
    );
  };

  return TableHeaderRow;
}(_react2.default.Component);

TableHeaderRow.propTypes = process.env.NODE_ENV !== "production" ? {
  children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func])), _propTypes2.default.element]),
  component: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.func, _propTypes2.default.string])
} : {};

var HeaderData = exports.HeaderData = function (_React$Component2) {
  _inherits(HeaderData, _React$Component2);

  function HeaderData() {
    var _temp, _this3, _ret;

    _classCallCheck(this, HeaderData);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this3 = _possibleConstructorReturn(this, _React$Component2.call.apply(_React$Component2, [this].concat(args))), _this3), _this3.state = {
      columns: _react2.default.Children.map(_this3.props.children, function (_ref) {
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
}(_react2.default.Component);