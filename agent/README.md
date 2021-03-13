# agent

## Usage

``` js

const Agent = require('agent')

const agent = new Agent({
  interval: 2000
})

agent.connect()

agent.on('agent(message', payload => {
  console.log(payload)
})

setTimeout(() => agent.disconnected(), 20000)

```