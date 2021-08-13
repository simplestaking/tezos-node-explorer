import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { StateMachineDiagramBlock } from '../../shared/types/state-machine/state-machine-diagram-block.type';
import { StateMachineProposal } from '../../shared/types/state-machine/state-machine-proposal.type';

@Injectable({
  providedIn: 'root'
})
export class StateMachineService {

  constructor(private http: HttpClient) { }

  getStateMachineDiagram(): Observable<StateMachineDiagramBlock[]> {
    return of(diagramStructure);
  }

  getStateMachineProposals(): Observable<StateMachineProposal[]> {
    return of(proposals);
  }
}

const diagramStructure: StateMachineDiagramBlock[] = [
  {
    type: 'info',
    title: 'P2P socket authenticate',
    id: 1,
    next: [21, 221, 90],
    status: 'completed',
    currentState: null,
    labels: ['Initiate', 'Receive connection message'],
    blocks: []
  },
  {
    type: 'info',
    title: 'Exchange connection messages',
    id: 2,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: [
      {
        type: 'info',
        title: 'Attempt to write connection message',
        id: 21,
        next: [22, 91],
        status: 'completed',
        currentState: null,
        labels: ['Successful Connection_message.write'],
        blocks: []
      },
      {
        type: 'info',
        title: 'Waiting for a response connection message',
        id: 22,
        next: [333, 92],
        status: 'completed',
        labels: ['Successful Connection_message.read'],
        currentState: null,
        blocks: []
      },
    ]
  },
  {
    type: 'info',
    title: 'Exchange connection messages',
    id: 112,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: [
      {
        type: 'info',
        title: 'Connection message received without having sent one attempt to read connection message',
        id: 221,
        next: [222, 93],
        status: 'completed',
        currentState: null,
        labels: ['Successful Connection_message.read'],
        blocks: []
      },
      {
        type: 'info',
        title: 'Attempt to respond',
        id: 222,
        next: [333, 94],
        status: 'completed',
        labels: ['Successful Connection_message.write'],
        currentState: null,
        blocks: []
      },
    ]
  },
  {
    type: 'info',
    title: 'Connection messages exchanged successfully',
    id: 333,
    next: [3, 95],
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Exchange metadata message',
    id: 3,
    next: [4, 96],
    status: 'active',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Exchange ack message',
    id: 4,
    next: [5, 97],
    status: 'pending',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Exchange metadata chunks',
    id: 5,
    next: [6, 98],
    labels: ['Finish exchanging metadata chunks'],
    status: 'pending',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Authenticated connection',
    id: 6,
    next: [7, 99],
    status: 'pending',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Exchanging ack/nack chunks',
    id: 7,
    next: [8, 100],
    status: 'pending',
    currentState: null,
    labels: ['Finish exchanging ack/nack chunks'],
    blocks: []
  },
  {
    type: 'info',
    title: 'Connection accepted!',
    id: 8,
    next: [],
    status: 'pending',
    currentState: null,
    blocks: []
  },
  {
    type: 'error',
    title: 'Unknown Error',
    id: 90,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'error',
    title: 'P2p Error',
    id: 91,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'error',
    title: 'HTTP Error',
    id: 92,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'error',
    title: 'Service Failed',
    id: 93,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'error',
    title: 'WS Error',
    id: 94,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'error',
    title: 'Connection Error',
    id: 95,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'error',
    title: 'Thrown Unknown Error',
    id: 96,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'error',
    title: 'RocksDB Error',
    id: 97,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'error',
    title: 'Kernel Error',
    id: 98,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'error',
    title: 'XSS Error',
    id: 99,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'error',
    title: 'Security compromised - System Failed',
    id: 100,
    next: [],
    status: 'completed',
    currentState: null,
    blocks: []
  },
];

const proposals: StateMachineProposal[] = [
  {
    title: 'INITIATE_CONNECTION',
    payload: { data: 'I am a payload' },
    stateId: 1
  },
  {
    title: 'SUCCESSFUL_CONNECTION_MESSAGE_WRITE',
    payload: { data: 'I am information' },
    stateId: 21
  },
  {
    title: 'RECEIVE_CONNECTION_MESSAGE',
    payload: { data: 'I was measured by the debugger' },
    stateId: 22
  },
  {
    title: 'SUCCESSFUL_CONNECTION_MESSAGE_READ',
    payload: { data: 'I am data from Kernel' },
    stateId: 221
  },
  {
    title: 'SUCCESSFUL_CONNECTION_MESSAGE_READ',
    payload: { data: 'P2P data' },
    stateId: 333
  },
  {
    title: 'SUCCESSFUL_CONNECTION_MESSAGE_WRITE',
    payload: { data: 'I will write a connection message' },
    stateId: 3
  },
  {
    title: 'TRIGGER_METADATA_EXCHANGING',
    payload: { data: 'I exchange metadata' },
    stateId: 4
  },
  {
    title: 'START_EXCHANGING_METADATA_CHUNKS',
    payload: { data: 'I start now' },
    stateId: 5
  },
  {
    title: 'FINISH_EXCHANGING_METADATA_CHUNKS',
    payload: { data: 'I finish now the metadata chunks' },
    stateId: 6
  },
  {
    title: 'START_EXCHANGING_ACK_NACK_CHUNKS',
    payload: { data: 'ack nack ack nack' },
    stateId: 7
  },
  {
    title: 'FINISH_EXCHANGING_ACK_NACK_CHUNKS',
    payload: { data: 'Finish ack nack ack nack' },
    stateId: 8
  },
  {
    title: 'CONNECTION_ACCEPTED',
    payload: { data: 'I accept the connection. Now the state should look connected.' },
    stateId: 98
  },
];
