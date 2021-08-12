export interface StateMachineDiagramBlock {
  title: string;
  type: string;
  id: number;
  next: number[];
  status: string;
  currentState: any;
  blocks: StateMachineDiagramBlock[];
  labels?: string[];
}
