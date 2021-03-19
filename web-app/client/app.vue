<template>
  <div>
    <agent
      v-for="agent in agents"
      :uuid="agent.uuid"
      :key="agent.uuid"
      :socket="socket">
    </agent>
    <p v-if="error">{{error}}</p>
  </div>
</template>

<style>
  body {
    font-family: Arial;
    background: #f8f8f8;
    margin: 0;
  }
</style>

<script>
const io = require('socket.io-client')
const socket = io()

module.exports = {
  data () {
    return {
      'agents': [],
      'error': null,
      socket
    }
  },

  mounted () {
    this.initialize()
  },

  'methods': {
    async initialize () {
      let result
      try {
        result = await fetch('http://localhost:8080/agents')
      } catch (err) {
        console.log(err)
        return
      }

      result = await result.json()

      this.agents = result

      socket.on('agent/connected', payload => {
        const { uuid } = payload.agent
        const existing = this.agents.find(a => a.uuid === uuid)
        if (!existing) {
          this.agents.push(payload.agent)
        }
      })
    }
  }
}
</script>
