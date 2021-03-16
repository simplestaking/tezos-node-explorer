import { ActionReducer, ActionReducerMap, MetaReducer, } from '@ngrx/store';
// import { storeLogger } from 'ngrx-store-logger';
import { environment } from '../environments/environment';

import * as fromRouter from '@ngrx/router-store';
import { RouterStateUrl } from './app.routing';

// add remote error loging
//   import * as LogRocket from 'logrocket';
//   import createNgrxMiddleware from 'logrocket-ngrx';
//   const logrocketMiddleware = createNgrxMiddleware(LogRocket);
// meta reducer for dynamic forms
import * as fromNgrxForm from './shared/ngrx-form.reducer';


import * as fromApp from './app.reducer';
import * as fromSettingsNode from './settings/settings-node/settings-node.reducer';

import * as fromMonitoring from './monitoring/monitoring.reducer';

import * as fromMempoolAction from './mempool/mempool-action/mempool-action.reducer';

import * as fromNetworkAction from './network/network-action/network-action.reducer';
import * as fromNetworkPeers from './network/network-peers/network-peers.reducer';
import * as fromNetworkStats from './network/network-stats/network-stats.reducer';
import * as fromNetworkHistory from './network/network-history/network-history.reducer';

import * as fromEndpointsAction from './endpoints/endpoints-action/endpoints-action.reducer';

import * as fromChainServer from './chain/chain-server/chain-server.reducer';
import * as fromChainWallets from './chain/chain-wallets/chain-wallets.reducer';
import * as fromChainConfig from './chain/chain-config/chain-config.reducer';
import * as fromChainFinish from './chain/chain-finish/chain-finish.reducer';

import * as fromLogsAction from './logs/logs-action/logs-action.reducer';

import * as fromStorageBlock from './storage/storage-block/storage-block.reducer';
import * as fromStorageAction from './storage/storage-action/storage-action.reducer';

import * as fromSandbox from './sandbox/sandbox.reducer';
import * as fromWallets from './wallets/wallets.reducer';
import * as fromVersion from './monitoring/commit-number/commit-number.reducer';
import * as fromResource from './resources/resources/resources.reducer';
import { ResourcesState } from './resources/resources/resources.reducer';
import { SettingsNode } from './shared/types/settings-node/settings-node.type';
import { NetworkStats } from './shared/types/network/network-stats.type';
import { NetworkPeers } from './shared/types/network/network-peers.type';
import { NetworkHistory } from './shared/types/network/network-history.type';
import { NetworkAction } from './shared/types/network/network-action.type';

export interface State {
  app: any;
  monitoring: any;
  mempoolAction: any;
  networkAction: NetworkAction;
  networkPeers: NetworkPeers;
  networkStats: NetworkStats;
  networkHistory: NetworkHistory;
  endpointsAction: any;
  logsAction: any;
  storageBlock: any;
  storageAction: any;
  chainServer: any;
  chainWallets: any;
  chainConfig: any;
  chainFinish: any;
  settingsNode: SettingsNode;
  sandbox: any;
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  wallets: any;
  commitNumber: any;
  resources: ResourcesState;
}

// state
export const reducers: ActionReducerMap<State> = {
  app: fromApp.reducer,
  monitoring: fromMonitoring.reducer,
  mempoolAction: fromMempoolAction.reducer,
  networkAction: fromNetworkAction.reducer,
  networkPeers: fromNetworkPeers.reducer,
  networkStats: fromNetworkStats.reducer,
  networkHistory: fromNetworkHistory.reducer,
  endpointsAction: fromEndpointsAction.reducer,
  logsAction: fromLogsAction.reducer,
  storageBlock: fromStorageBlock.reducer,
  storageAction: fromStorageAction.reducer,
  chainServer: fromChainServer.reducer,
  chainWallets: fromChainWallets.reducer,
  chainConfig: fromChainConfig.reducer,
  chainFinish: fromChainFinish.reducer,
  sandbox: fromSandbox.reducer,
  settingsNode: fromSettingsNode.reducer,
  routerReducer: fromRouter.routerReducer,
  wallets: fromWallets.reducer,
  commitNumber: fromVersion.reducer,
  resources: fromResource.reducer,
};

// // log all actions to console for production
// export function logger(reducer: ActionReducer<State>): any {
//     // default, no options
//     return storeLogger()(reducer);
// }

// compose all reducers to map
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [fromNgrxForm.form, nodeSwitchStateMetaReducer]
  : [fromNgrxForm.form, nodeSwitchStateMetaReducer
    //    ,logger
  ];

export function nodeSwitchStateMetaReducer(reducer: ActionReducer<State>): ActionReducer<State> {
  return function clearStateFn(state: State, action: any) {
    if (action.type === 'APP_NODE_CHANGE') {
      state = {
        app: {
          ...state.app,
          initialized: false
        },
        settingsNode: {
          activeNode: state.settingsNode.entities[action.payload.activeNode.id],
          entities: { ...state.settingsNode.entities },
          ids: [...state.settingsNode.ids],
          debugger: state.settingsNode.debugger
        } as SettingsNode
      } as State;
    }
    return reducer(state, action);
  };
}
