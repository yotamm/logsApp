import {Status} from "./Status.enum";
import {Step} from "./Step.model";

export interface BuildMetaData {
  accountId: string;
  data: { created: number, finished: number, started: number };
  id: string;
  lastUpdate: number;
  status: Status;
  visibility: string;
  steps: Step[];
}
