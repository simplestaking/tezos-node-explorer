import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { SystemResources } from '../../shared/types/resources/system/system-resources.type';
import { DatePipe } from '@angular/common';
import { SystemResourcesPanel } from '../../shared/types/resources/system/system-resources-panel.type';
import { SystemResourcesPanelBlock } from '../../shared/types/resources/system/system-resources-panel-block.type';
import { SystemResourcesSubcategoryRunnerGroup } from '../../shared/types/resources/system/system-resources-subcategory-runner-group.type';

const MB_DIVISOR = 1048576;
const GB_DIVISOR = 1073741824;
const COLOR_SCHEME = {
  domain: [
    '#46afe3',
    '#bf5af2',
    '#32d74b',
    '#ff9f0a',
    '#ffd60a',
    '#00dbc6',
    '#ff2d55',
  ]
};

@Injectable({
  providedIn: 'root'
})
export class SystemResourcesService {

  constructor(private http: HttpClient,
              private datePipe: DatePipe) { }

  getSystemResources(endpoint: string, isSmallDevice: boolean): Observable<SystemResources> {
    return this.http.get<SystemResources>(endpoint, { reportProgress: true })
      .pipe(
        map(response => this.mapGetSystemResourcesResponse(response, isSmallDevice)),
        catchError(err => throwError(err))
      );
  }

  private mapGetSystemResourcesResponse(response: any, isSmallDevice: boolean): SystemResources {
    const resources = response.reverse().map(responseItem => {
      const resource: any = {};
      resource.timestamp = this.datePipe.transform(responseItem.timestamp * 1000, 'MM/dd, HH:mm:ss');

      resource.memory = {};
      resource.memory.node = {};
      resource.memory.node = responseItem.memory.node / MB_DIVISOR;
      resource.memory.total = resource.memory.node;

      if (responseItem.memory.validators) {
        resource.memory.validators = {};
        resource.memory.validators.total = responseItem.memory.validators.total / MB_DIVISOR;
        resource.memory.total += resource.memory.validators.total;
        resource.memory.runnerGroups = [{
          property: 'Validators',
          label: 'MB',
          total: responseItem.memory.validators.validators.total,
          values: Object.keys(responseItem.memory.validators.validators).map(key => ({
            name: key,
            total: responseItem.memory.validators.validators[key] / MB_DIVISOR
          }))
        }] as SystemResourcesSubcategoryRunnerGroup[];
      }

      resource.cpu = {};
      resource.cpu.node = responseItem.cpu.node.collective;
      resource.cpu.validators = responseItem.cpu.validators.total;
      resource.cpu.total = Object.values(resource.cpu).filter(Boolean).reduce((total: number, current: number) => total + current, 0);
      resource.cpu.runnerGroups = [
        {
          property: 'Node task threads',
          label: '%',
          total: responseItem.cpu.node.collective,
          values: Object.keys(responseItem.cpu.node.taskThreads).map(key => ({
            name: key,
            total: responseItem.cpu.node.taskThreads[key]
          }))
        },
        ...Object.keys(responseItem.cpu.validators.validators).map(protocolKey => ({
          property: protocolKey,
          label: '%',
          total: responseItem.cpu.validators.validators[protocolKey].collective,
          values: Object.keys(responseItem.cpu.validators.validators[protocolKey].taskThreads).map(key => ({
            name: key,
            total: responseItem.cpu.validators.validators[protocolKey].taskThreads[key],
          }))
        }))
      ] as SystemResourcesSubcategoryRunnerGroup[];

      resource.storage = {};
      resource.storage.blockStorage = responseItem.disk.blockStorage / GB_DIVISOR;
      resource.storage.contextIrmin = responseItem.disk.contextIrmin / GB_DIVISOR;
      resource.storage.mainDb = (responseItem.disk.mainDb !== undefined) ? responseItem.disk.mainDb / GB_DIVISOR : undefined;
      resource.storage.debugger = responseItem.disk.debugger / GB_DIVISOR;
      resource.storage.contextActions = (responseItem.disk.contextActions !== undefined) ? responseItem.disk.contextActions / GB_DIVISOR : undefined;
      resource.storage.contextMerkleRocksDb = (responseItem.disk.contextMerkleRocksdb !== undefined) ? responseItem.disk.contextMerkleRocksdb / GB_DIVISOR : undefined;
      resource.storage.total = Object.values(resource.storage).filter(Boolean).reduce((total: number, current: number) => total + current, 0);

      resource.network = {};
      resource.network.sentPerSec = responseItem.network.sentBytesPerSec / MB_DIVISOR;
      resource.network.receivedPerSec = responseItem.network.receivedBytesPerSec / MB_DIVISOR;

      resource.io = {};
      resource.io.node = {};
      resource.io.validators = {};
      resource.io.node.readPerSec = responseItem.io.node.readBytesPerSec / MB_DIVISOR;
      resource.io.node.writtenPerSec = responseItem.io.node.writtenBytesPerSec / MB_DIVISOR;
      resource.io.validators.readPerSec = responseItem.io.validators.total.readBytesPerSec / MB_DIVISOR;
      resource.io.validators.writtenPerSec = responseItem.io.validators.total.writtenBytesPerSec / MB_DIVISOR;
      resource.io.totalRead = Object
        .values({
          nodeRead: resource.io.node.readPerSec,
          validatorsRead: resource.io.validators.readPerSec,
        })
        .filter(Boolean)
        .reduce((total: number, current: number) => total + current, 0);
      resource.io.totalWrite = Object
        .values({
          nodeWrite: resource.io.node.writtenPerSec,
          validatorsWrite: resource.io.validators.writtenPerSec,
        })
        .filter(Boolean)
        .reduce((total: number, current: number) => total + current, 0);
      resource.io.runnerGroups = Object.keys(responseItem.io.validators.validators)
        .map(protocolKey => ({
          property: protocolKey,
          label: 'MB',
          values: Object.keys(responseItem.io.validators.validators[protocolKey]).map(key => ({
            name: key.includes('read') ? 'Read per sec' : 'Written per sec',
            total: responseItem.io.validators.validators[protocolKey][key] / MB_DIVISOR,
          }))
        })) as SystemResourcesSubcategoryRunnerGroup[];

      return resource;
    });

    return this.createChartData(resources, isSmallDevice);
  }

  private createChartData(resources: any[], isSmallDevice: boolean): SystemResources {
    const chartData = {
      cpu: { series: [], formattingType: '%' },
      memory: { series: [], formattingType: 'MB' },
      storage: { series: [], formattingType: 'GB' },
      io: { series: [], formattingType: 'MB' },
      network: { series: [], formattingType: 'MB' },
      colorScheme: COLOR_SCHEME,
      resourcesPanel: this.createSummaryBlocks(resources),
    } as SystemResources;

    if (!resources.length) {
      return chartData;
    }

    if (resources[0].cpu.validators !== undefined) {
      chartData.cpu.series.push({
        name: 'TOTAL',
        series: this.getSeries(resources, 'cpu.total')
      });
      chartData.cpu.series.push({
        name: 'NODE',
        series: this.getSeries(resources, 'cpu.node', 'cpu.runnerGroups')
      });
      chartData.cpu.series.push({
        name: 'VALIDATORS',
        series: this.getSeries(resources, 'cpu.validators')
      });
      chartData.cpu.labels = ['Total', 'Node', 'Validators'];
    } else {
      chartData.cpu.series.push({
        name: 'NODE',
        series: this.getSeries(resources, 'cpu.node', 'cpu.runnerGroups')
      });
      chartData.cpu.labels = ['Node'];
    }

    chartData.memory.series.push({
      name: 'TOTAL',
      series: this.getSeries(resources, 'memory.total')
    });
    chartData.memory.series.push({
      name: 'NODE',
      series: this.getSeries(resources, 'memory.node')
    });
    chartData.memory.labels = ['Total', 'Node'];
    if (resources[0].memory.validators !== undefined) {
      chartData.memory.series.push({
        name: 'VALIDATORS',
        series: this.getSeries(resources, 'memory.validators.total', 'memory.runnerGroups')
      });
      chartData.memory.labels.push('Validators');
    }

    chartData.storage.series.push({
      name: 'TOTAL',
      series: this.getSeries(resources, 'storage.total')
    });
    chartData.storage.series.push({
      name: 'BLOCK STORAGE',
      series: this.getSeries(resources, 'storage.blockStorage')
    });
    chartData.storage.series.push({
      name: 'CONTEXT IRMIN',
      series: this.getSeries(resources, 'storage.contextIrmin')
    });
    chartData.storage.series.push({
      name: 'DEBUGGER',
      series: this.getSeries(resources, 'storage.debugger')
    });
    chartData.storage.labels = ['Total', 'Block Storage', 'Context Irmin', 'Debugger'];
    if (resources[0].storage.contextActions !== undefined) {
      chartData.storage.series.push({
        name: 'CONTEXT ACTIONS',
        series: this.getSeries(resources, 'storage.contextActions')
      });
      chartData.storage.labels.push('Context Actions');
    }
    if (resources[0].storage.contextMerkleRocksDb !== undefined) {
      chartData.storage.series.push({
        name: 'CONTEXT MERKLE ROCKS DB',
        series: this.getSeries(resources, 'storage.contextMerkleRocksDb')
      });
      chartData.storage.labels.push('Context Merkle Rocks DB');
    }
    if (resources[0].storage.mainDb !== undefined) {
      chartData.storage.series.push({
        name: 'MAIN DB',
        series: this.getSeries(resources, 'storage.mainDb')
      });
      chartData.storage.labels.push('Main DB');
    }

    chartData.network.series.push({
      name: 'SENT PER SECOND',
      series: this.getSeries(resources, 'network.sentPerSec')
    });
    chartData.network.series.push({
      name: 'RECEIVED PER SECOND',
      series: this.getSeries(resources, 'network.receivedPerSec')
    });
    chartData.network.labels = ['Sent per second', 'Received per second'];

    chartData.io.series.push({
      name: 'TOTAL READ',
      series: this.getSeries(resources, 'io.totalRead', 'io.runnerGroups')
    });
    chartData.io.series.push({
      name: 'TOTAL WRITE',
      series: this.getSeries(resources, 'io.totalWrite')
    });
    chartData.io.series.push({
      name: 'NODE - READ PER SECOND',
      series: this.getSeries(resources, 'io.node.readPerSec')
    });
    chartData.io.series.push({
      name: 'NODE - WRITTEN PER SECOND',
      series: this.getSeries(resources, 'io.node.writtenPerSec')
    });
    chartData.io.series.push({
      name: 'VALIDATORS - READ PER SECOND',
      series: this.getSeries(resources, 'io.validators.readPerSec')
    });
    chartData.io.series.push({
      name: 'VALIDATORS - WRITTEN PER SECOND',
      series: this.getSeries(resources, 'io.validators.writtenPerSec')
    });
    chartData.io.labels = ['Total read', 'Total write', 'Node - read per second', 'Node - written per second', 'Validators - read per second', 'Validators - written per second'];

    chartData.xTicksValues = this.getFilteredXTicks(resources, Math.min(resources.length, isSmallDevice ? 2 : 7));

    return chartData;
  }

  private getSeries(resources: any, pathToProperty: string, runnerGroupsPath?: string): { name: string; value: number }[] {
    return resources.map(resource => ({
      name: resource.timestamp,
      value: this.getValueFromNestedResourceProperty(resource, pathToProperty),
      runnerGroups: runnerGroupsPath ? this.getValueFromNestedResourceProperty(resource, runnerGroupsPath) : undefined
    }));
  }

  private getValueFromNestedResourceProperty(resource: any, pathToProperty: string): number {
    return pathToProperty.split('.').reduce((obj: any, property: string) => obj[property], resource);
  }

  private getFilteredXTicks(resources: any[], noOfResults: number): string[] {
    const xTicks = [];
    const delta = Math.floor(resources.length / noOfResults);
    for (let i = 0; i <= resources.length; i = i + delta) {
      if (resources[i]) {
        xTicks.push(resources[i].timestamp);
      }
    }
    return xTicks;
  }

  private createSummaryBlocks(resources: any[]): SystemResourcesPanel {
    const panel: SystemResourcesPanel = {
      blocks: [],
      runnerGroups: [],
      timestamp: '',
      type: 'recently',
      resourceType: 'cpu',
      sortBy: 'size'
    };

    if (!resources.length) {
      return panel;
    }

    const lastResource = resources[resources.length - 1];
    panel.timestamp = lastResource.timestamp;
    if (lastResource.cpu.validators !== undefined) {
      panel.blocks = [
        { name: 'Total', value: lastResource.cpu.total, formattingType: '%'},
        { name: 'Node', value: lastResource.cpu.node, formattingType: '%'},
        { name: 'Validators', value: lastResource.cpu.validators, formattingType: '%'},
      ];
    } else {
      panel.blocks = [
        { name: 'Node', value: lastResource.cpu.node, formattingType: '%'},
      ];
    }
    panel.runnerGroups = lastResource.cpu.runnerGroups;

    return panel;
  }
}
