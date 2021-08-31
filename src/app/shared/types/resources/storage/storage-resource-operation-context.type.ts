import { ResourceStorageQuery } from './storage-resource-operation.type';

export class StorageResourceOperationContext {
  root: string;
  queriesCount: number;
  totalTime: number;
  totalTimeRead: number;
  totalTimeWrite: number;
  mem: ResourceStorageQuery;
  memTree: ResourceStorageQuery;
  find: ResourceStorageQuery;
  findTree: ResourceStorageQuery;
  add: ResourceStorageQuery;
  addTree: ResourceStorageQuery;
  remove: ResourceStorageQuery;
}
