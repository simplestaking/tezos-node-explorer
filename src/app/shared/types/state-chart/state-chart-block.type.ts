export class StateChartBlock {
  title: string;
  type: string;
  id: number;
  next: number[];
  prev: number;
  status: string;
  currentState: any;
  blocks: StateChartBlock[];
  labels?: string[];
}
