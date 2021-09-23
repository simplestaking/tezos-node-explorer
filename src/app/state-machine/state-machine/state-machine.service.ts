import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { StateMachineDiagramBlock } from '@shared/types/state-machine/state-machine-diagram-block.type';
import { StateMachineProposal } from '@shared/types/state-machine/state-machine-proposal.type';

// @ts-ignore
import * as serverData from './state-machine.json';
import { delay } from 'rxjs/operators';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateMachineService {

  private data = serverData.default as any;

  constructor(private http: HttpClient) { }

  getStateMachineState(): Observable<any> {
    return this.http.get<any>('http://192.168.100.3:18732/state');
  }

  getStateMachineDiagram(): Observable<StateMachineDiagramBlock[]> {
    return of(diagramStructure).pipe(delay(50));
  }

  getStateMachineProposals(): Observable<StateMachineProposal[]> {
    return this.http.get<StateMachineProposal[]>('http://192.168.100.3:18732/actions')
      .pipe(
        tap(response => {
          response.forEach(action => {
            // action.state = JSON.parse(`{"config":{"port":9732,"disable_mempool":false,"private_node":false,"pow_target":26.0,"identity":{"peer_id":[86,205,231,178,152,146,2,157,213,131,90,117,83,132,177,84],"public_key":[148,73,141,148,22,20,15,188,69,132,149,51,61,170,193,180,200,126,65,159,87,38,113,122,84,249,182,198,116,118,174,28],"secret_key":[172,122,207,58,254,215,99,123,225,15,143,199,106,46,182,179,53,156,120,173,177,216,19,180,28,186,179,250,233,84,244,177],"proof_of_work_stamp":[187,194,48,1,73,36,158,28,204,132,165,67,98,35,108,60,187,194,204,47,251,211,182,234]},"shell_compatibility_version":{"distributed_db_versions":[0,1],"p2p_versions":[1],"version":{"chain_name":"TEZOS_MAINNET","distributed_db_version":1,"p2p_version":1}}},"peers":{"[::ffff:18.184.136.151]:9732":{"status":{"Handshaking":{"token":0,"status":{"ConnectionMessageRead":{"conn_msg_written":[0,103,38,4,148,73,141,148,22,20,15,188,69,132,149,51,61,170,193,180,200,126,65,159,87,38,113,122,84,249,182,198,116,118,174,28,187,194,48,1,73,36,158,28,204,132,165,67,98,35,108,60,187,194,204,47,251,211,182,234,29,133,237,66,3,12,186,169,13,136,160,104,37,72,92,41,104,129,38,190,141,207,156,142,0,0,0,13,84,69,90,79,83,95,77,65,73,78,78,69,84,0,1,0,1],"status":{"Success":{"message":{"port":9732,"compatible_version":{"chain_name":"TEZOS_MAINNET","distributed_db_version":1,"p2p_version":1},"public_key":[127,185,162,80,14,4,254,67,146,126,60,39,51,83,178,198,202,195,225,170,123,197,162,55,66,242,71,106,102,3,4,127],"encoded":[0,103,38,4,127,185,162,80,14,4,254,67,146,126,60,39,51,83,178,198,202,195,225,170,123,197,162,55,66,242,71,106,102,3,4,127,92,35,19,30,10,138,39,97,226,137,17,157,254,102,1,209,126,65,8,112,146,40,191,17,37,216,250,188,41,211,190,4,90,191,43,93,148,227,30,64,201,229,82,50,63,251,105,22,0,0,0,13,84,69,90,79,83,95,77,65,73,78,78,69,84,0,1,0,1]}}}}},"incoming":false}}},"[::ffff:18.185.78.112]:9732":{"status":"Potential"},"[::ffff:18.185.162.144]:9732":{"status":"Potential"},"[::ffff:18.185.162.213]:9732":{"status":"Potential"},"[::ffff:18.195.59.36]:9732":{"status":"Potential"},"[2a05:d018:619:5801:3f35:9d6a:9437:e515]:9732":{"status":"Potential"},"[2a05:d018:619:5801:53d8:e6df:f284:6d1]:9732":{"status":"Potential"},"[2a05:d018:619:5802:14ef:ecf7:ba46:99f1]:9732":{"status":"Potential"},"[2a05:d018:619:5803:3800:dd60:a6ec:1c8b]:9732":{"status":"Potential"},"[2a05:d018:619:5803:dc8c:56a3:c99d:e5fd]:9732":{"status":"Potential"}},"peers_dns_lookup":null,"storage":{"block_headers_put":[],"requests":{"list":{},"counter":3}},"last_action_id":98}`);
            // action.state.config.port =  Math.floor(Math.random() * 10000);
            // action.state.last_action_id = action.id;
            // action.state.config.pow_target = Math.floor(Math.random() * 10000);
            action.state.config.identity.peer_id = {
              test: [1000]
            };
          });
        })
      );
  }
}

const diagramStructure: StateMachineDiagramBlock[] = [
  {
    type: 'info',
    title: 'P2P socket authenticate',
    id: 1,
    next: [21, 221, 90],
    status: 'completed',
  },
  {
    type: 'info',
    title: 'Attempt to write connection message',
    id: 21,
    next: [22, 91],
    status: 'completed',
  },
  {
    type: 'info',
    title: 'Waiting for a response connection message',
    id: 22,
    next: [333, 92],
    status: 'completed',
  },
  {
    type: 'info',
    title: 'Connection message received without having sent one attempt to read connection message',
    id: 221,
    next: [222, 93],
    status: 'completed',
  },
  {
    type: 'info',
    title: 'Attempt to respond',
    id: 222,
    next: [333, 94],
    status: 'completed',
  },
  {
    type: 'info',
    title: 'Connection messages exchanged successfully',
    id: 333,
    next: [3, 95],
    status: 'completed',
  },
  {
    type: 'info',
    title: 'Exchange metadata message',
    id: 3,
    next: [4, 96],
    status: 'active',
  },
  {
    type: 'info',
    title: 'Exchange ack message',
    id: 4,
    next: [5, 97],
    status: 'pending',
  },
  {
    type: 'info',
    title: 'Exchange metadata chunks',
    id: 5,
    next: [6, 98],
    status: 'pending',
  },
  {
    type: 'info',
    title: 'Authenticated connection',
    id: 6,
    next: [7],
    status: 'pending',
  },
  {
    type: 'info',
    title: 'Exchanging ack/nack chunks',
    id: 7,
    next: [8],
    status: 'pending',
  },
  {
    type: 'info',
    title: 'Connection accepted!',
    id: 8,
    next: [],
    status: 'pending',
  },
  {
    type: 'error',
    title: 'Unknown Error',
    id: 90,
    next: [],
    status: 'completed',
  },
  {
    type: 'error',
    title: 'P2p Error',
    id: 91,
    next: [],
    status: 'completed',
  },
  {
    type: 'error',
    title: 'HTTP Error',
    id: 92,
    next: [],
    status: 'completed',
  },
  {
    type: 'error',
    title: 'Service Failed',
    id: 93,
    next: [],
    status: 'completed',
  },
  {
    type: 'error',
    title: 'WS Error',
    id: 94,
    next: [],
    status: 'completed',
  },
  {
    type: 'error',
    title: 'Connection Error',
    id: 95,
    next: [],
    status: 'completed',
  },
  {
    type: 'error',
    title: 'Thrown Unknown Error',
    id: 96,
    next: [],
    status: 'completed',
  },
  {
    type: 'error',
    title: 'Blacklisted',
    id: 97,
    next: [],
    status: 'completed',
  },
  {
    type: 'error',
    title: 'Kernel Error',
    id: 98,
    next: [],
    status: 'completed',
  },
];

// const proposals: StateMachineProposal[] = [
//   {
//     title: 'INITIATE_CONNECTION',
//     id: 1,
//     content: {
//       data: 'I am a payload',
//       payloadMetadata: { value: '1203912809', hex: 'BLx4CyvBEua81n10n1e0fifhf0' }
//     },
//   },
//   {
//     title: 'SUCCESSFUL_CONNECTION_MESSAGE_WRITE',
//     id: 2,
//     payload: {
//       data: 'I am information',
//       info2: 123,
//       info4: { info: { stats: 'Diagram successful' } }
//     },
//     stateId: 21,
//     timestamp: 1628841546132,
//   },
//   {
//     title: 'RECEIVE_CONNECTION_MESSAGE',
//     id: 3,
//     payload: {
//       data: 'I was measured by the debugger',
//       moreMetadata: { data: { data: { data: 'no info' } } }, time: 'Today'
//     },
//     stateId: 22,
//     timestamp: 1628841556634,
//   },
//   {
//     title: 'SUCCESSFUL_CONNECTION_MESSAGE_READ',
//     id: 4,
//     payload: { data: 'P2P data' },
//     stateId: 333,
//     timestamp: 1628841576326,
//   },
//   {
//     title: 'SUCCESSFUL_CONNECTION_MESSAGE_READ',
//     id: 5,
//     payload: { data: 'I am data from Kernel', kernel1: 'protocol1244', kernel2: 'thread 088899' },
//     stateId: 221,
//     timestamp: 1628841566753,
//   },
//   {
//     title: 'SUCCESSFUL_CONNECTION_MESSAGE_READ_THREAD6',
//     id: 6, payload: { data: 'I am data from Core6', kernel1: '123124', kernel2: 'thread 3515' },
//     stateId: 222,
//     timestamp: 1628841566753,
//   },
//   {
//     title: 'SUCCESSFUL_CONNECTION_MESSAGE_WRITE',
//     id: 7, payload: { data: 'I will write a connection message' },
//     stateId: 3,
//     timestamp: 1628841586754,
//   },
//   {
//     title: 'TRIGGER_METADATA_EXCHANGING',
//     id: 8, payload: {
//       data: 'I exchange metadata',
//       data2: {
//         data: { data: { data: 'no data' } }
//       },
//       time: 'Today',
//       event: 'Proposal',
//       id: 91118284,
//       key: 'p2p000c'
//     },
//     stateId: 4,
//     timestamp: 1628841593756,
//   },
//   {
//     title: 'START_EXCHANGING_METADATA_CHUNKS',
//     id: 9, payload: { data: 'I start now', values: '1 2 3 5 59 17 2' },
//     stateId: 5,
//     timestamp: 1628841613746,
//   },
//   {
//     title: 'FINISH_EXCHANGING_METADATA_CHUNKS',
//     id: 10, payload: { data: 'I finish now the metadata chunks' },
//     stateId: 6,
//     timestamp: 1628841626756,
//   },
//   {
//     title: 'START_EXCHANGING_ACK_NACK_CHUNKS',
//     id: 11, payload: { data: { ack: 'ack nack ack nack', nack: 'nack nack' } },
//     stateId: 7,
//     timestamp: 1628841636657,
//   },
//   {
//     title: 'FINISH_EXCHANGING_ACK_NACK_CHUNKS',
//     id: 12, payload: {
//       data: 'Finish ack nack ack nack',
//       stateThing: { data: 10019 },
//       integration: {
//         timestamp: 1628841654756,
//         stringTime: '10 Dec. 2021'
//       }
//     },
//     stateId: 8,
//     timestamp: 1628841654756,
//   },
//   {
//     title: 'EXIT_SUCCESSFULLY',
//     id: 13, payload: {
//       data: 'I accept the connection. I exit bye.',
//       metadata: {
//         data2: '...Exited!.',
//         timestamp: 211131313132
//       }
//     },
//     stateId: 97,
//     timestamp: 1628841794244,
//   },
//   {
//     title: 'CONNECTION_ACCEPTED',
//     id: 14, payload: {
//       data: 'I accept the connection. Now the state should look connected.',
//       metadata: {
//         data2: 'Exit.',
//         stateId: 98,
//         timestamp: 1628841694706
//       }
//     },
//     stateId: 98,
//     timestamp: 1628841694706,
//   }
// ];
