# storage_module

## Usage

```js

const setupDatabase = require('storage_module')

setupDatabase(config)
.then(db => {
  const { Agent, Metric } = db
})
.catch(err => console.error(err))

```