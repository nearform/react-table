'use strict';

exports.__esModule = true;
exports.TableConsumer = exports.TableProvider = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _React$createContext = _react2.default.createContext(),
    TableProvider = _React$createContext.Provider,
    TableConsumer = _React$createContext.Consumer;

exports.TableProvider = TableProvider;
exports.TableConsumer = TableConsumer;