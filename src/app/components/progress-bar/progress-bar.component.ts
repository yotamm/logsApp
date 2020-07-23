import {Component, Input, OnInit} from '@angular/core';
import {Step} from "../../models/Step.model";

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() steps: Step[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
