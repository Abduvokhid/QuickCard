module.exports = {
  apps: [{
    name: 'quickcard',
    script: 'index.js',
    watch: true,
    ignore_watch: ['node_modules'],
    instance_var: 'INSTANCE_ID',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
  }]
}
