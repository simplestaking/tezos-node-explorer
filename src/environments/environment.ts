export const environment = {
  production: false,
  api:
    [{
      id: 'tezedge',
      type: 'tezedge',
      name: 'drone-test-node',
      http: 'http://develop.dev.tezedge.com:18732',
      p2p_port: '9732',
      features: [{ name: 'ws', url: 'ws://develop.dev.tezedge.com:4927' }, { name: 'debugger', url: 'http://develop.dev.tezedge.com:17732' }, {
        name: 'sandbox',
        url: 'http://develop.dev.tezedge.com:3030'
      }, { name: 'commit', id: 'develop' }, { name: 'monitoring' }, {
        name: 'resources/system',
        monitoringUrl: 'http://develop.dev.tezedge.com:38732/resources/tezedge'
      }, {
        name: 'resources/memory',
        memoryProfilerUrl: 'http://develop.dev.tezedge.com:17832'
      }, { name: 'resources/storage' }, { name: 'mempool' }, { name: 'storage' }, { name: 'network' }, { name: 'logs' }, { name: 'state' }]
    }, {
      id: 'octez',
      name: 'octez.develop.dev.tezedge.com',
      http: 'http://develop.dev.tezedge.com:18733',
      p2p_port: '9733',
      type: 'octez',
      features: [{ name: 'debugger', url: 'http://develop.dev.tezedge.com:17732' }, {
        name: 'sandbox',
        url: 'http://localhost:3030'
      }, { name: 'monitoring' }, {
        name: 'resources/system',
        monitoringUrl: 'http://develop.dev.tezedge.com:38732/resources/ocaml'
      }, { name: 'resources/memory', memoryProfilerUrl: 'http://develop.dev.tezedge.com:17832' }, { name: 'mempool' }, { name: 'network' }, { name: 'logs' }]
    }]
};
