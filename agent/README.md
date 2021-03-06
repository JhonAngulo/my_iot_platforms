# agent

## Usage

``` js

const Agent = require('agent')

const agent = new Agent({
  name: 'my-app',
  username: 'admin',
  interval: 2000,
})

agent.addMetric('rss', function getRss () {
  return process.memoryUsage().rss
})

agent.addMetric('promiseMetric', function getRandomPromise () {
  return Promise.resolve(Math.random())
})

agent.addMetric('callbackMetric', function getRandomCallback (callback) {
  setTimeout(() => {
    callback(null, Math.random())
  }, 1000)
})

agent.connect()

// This agent only
agent.on('connected', handle)
agent.on('disconnected', handle)
agent.on('message', handle)

// Other Agents
agent.on('agent/connected', handler)
agent.on('agent/disconnected', handler)
agent.on('agent/message', handler)

agent.on('agent(message', payload => {
  console.log(payload)
})

setTimeout(() => agent.disconnected(), 20000)

```