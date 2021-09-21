import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { StateMachineDiagramBlock } from '@shared/types/state-machine/state-machine-diagram-block.type';
import { StateMachineProposal } from '@shared/types/state-machine/state-machine-proposal.type';

// @ts-ignore
import * as serverData from './state-machine.json';
import { delay } from 'rxjs/operators';

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
    return this.http.get<StateMachineProposal[]>('http://192.168.100.3:18732/actions');
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
