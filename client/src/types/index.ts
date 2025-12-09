export interface Plan {
  id: number;
  month: string;
  activityType?: string;
  priority?: string;
  status?: string;
  owner?: string;
  note?: string;
  appId: number;
}

export interface PortfolioApp {
  id: number;
  name: string;
  monthOrder?: string;
  priority?: string;
  type?: string;
  executor?: string;
  link?: string;
  referenceApp?: string;
  updateIssue?: string;
  requestInfo?: string;
  retention?: { d1?: number, d7?: number, d30?: number };
  volume?: number;
  status?: string;
  strategy?: string;
  store?: string;
  category?: string;
  group?: string;
  startDate?: string;
  releaseDate?: string;
  owner?: string;
  Plans?: Plan[];
}

