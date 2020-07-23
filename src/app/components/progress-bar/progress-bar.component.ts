import {Component, Input, OnInit} from '@angular/core';
import {Step} from "../../models/Step.model";
import {Status} from "../../models/Status.enum";

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() steps: Step[] = [{status: Status.success, name: 'step 1', logs: []}, {status: Status.inProgress, name: 'step 2', logs: []}, {status: Status.failure, name: 'step 3', logs: []}, {status: Status.unknown, name: 'step 4', logs: []}];

  constructor() { }

  ngOnInit(): void {
  }

}
