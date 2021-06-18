(function (window) {
  window['env'] = window['env'] || {};

  window['env']['commit'] = '';
  window['env']['memoryProfiler'] = 'http://develop.dev.tezedge.com:17832';
  window['env']['sandbox'] = 'https://carthage.tezedge.com:3030';
  window['env']['debugger'] = 'https://carthage.tezedge.com:8753';
  window['env']['api'] = [
    {
      id: 'rust.carthage.tezedge.com',
      name: 'rust.carthage.tezedge.com',
      http: 'https://carthage.tezedge.com:8752',
      monitoring: 'https://carthage.tezedge.com:8754/resources/tezedge',
      ws: 'wss://carthage.tezedge.com:443',
      p2p_port: '9732',
      features: ['MONITORING', 'RESOURCES', 'MEMPOOL_ACTION', 'STORAGE_BLOCK', 'NETWORK_ACTION', 'LOGS_ACTION'],
      resources: ['system', 'storage', 'memory']
    },
    {
      id: 'ocaml.carthage.tezedge.com',
      name: 'ocaml.carthage.tezedge.com',
      http: 'https://carthage.tezedge.com:8742',
      monitoring: 'https://carthage.tezedge.com:8754/resources/ocaml',
      ws: false,
      p2p_port: '9733',
      features: ['MONITORING', 'RESOURCES', 'MEMPOOL_ACTION', 'NETWORK_ACTION', 'LOGS_ACTION'],
      resources: ['system', 'storage', 'memory']
    }
  ];
})(this);
