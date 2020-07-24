import {Status} from "./Status.enum";

export interface Step {
  creationTimeStamp?: number;
  finishTimeStamp?: number;
  name: string;
  status: Status;
}
