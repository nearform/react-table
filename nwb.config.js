module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactNfTable',
      externals: {
        react: 'React'
      }
    }
  }
}
