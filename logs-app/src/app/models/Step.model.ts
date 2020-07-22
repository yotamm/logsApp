import {Status} from "./Status.enum";

export interface Step {
  creationTimeStamp: number;
  finishTimeStamp: number;
  logs: string[];
  name: string;
  status: Status;
}
