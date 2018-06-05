test('exports a provider and consumer', () => {
  const Context = require('..')

  expect(Context.TableProvider).toBeDefined()
  expect(Context.TableConsumer).toBeDefined()
})
