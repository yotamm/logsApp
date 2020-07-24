import {Status} from "./Status.enum";

export interface Step {
  id: number;
  creationTimeStamp?: number;
  finishTimeStamp?: number;
  name: string;
  status: Status;
}
