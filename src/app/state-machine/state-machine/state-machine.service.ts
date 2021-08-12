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
    next: [21, 221],
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
        type: 'action',
        title: 'Attempt to write connection message',
        id: 21,
        next: [22],
        status: 'completed',
        currentState: null,
        labels: ['Successful Connection_message.write'],
        blocks: []
      },
      {
        type: 'info',
        title: 'Waiting for a response connection message',
        id: 22,
        next: [333],
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
        type: 'action',
        title: 'Connection message received without having sent one attempt to read connection message',
        id: 221,
        next: [222],
        status: 'completed',
        currentState: null,
        labels: ['Successful Connection_message.read'],
        blocks: []
      },
      {
        type: 'info',
        title: 'Attempt to respond',
        id: 222,
        next: [333],
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
    next: [3, 1000],
    status: 'completed',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Exchange metadata message',
    id: 3,
    next: [4, 1000],
    status: 'active',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Exchange ack message',
    id: 4,
    next: [5, 1000],
    status: 'pending',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Exchange metadata chunks',
    id: 5,
    next: [6, 1000],
    labels: ['Finish exchanging metadata chunks'],
    status: 'pending',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Authenticated connection',
    id: 6,
    next: [7],
    status: 'pending',
    currentState: null,
    blocks: []
  },
  {
    type: 'info',
    title: 'Exchanging ack/nack chunks',
    id: 7,
    next: [8, 1000],
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
    title: 'Error',
    id: 1000,
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
    stateId: 1000
  },
];
