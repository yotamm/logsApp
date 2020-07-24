import { Component, OnInit } from '@angular/core';
import {BuildInfoService} from "../../services/build-info.service";
import {Step} from "../../models/Step.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  buildInfo: Step[];

  constructor(private buildInfoService: BuildInfoService) { }

  ngOnInit(): void {
    this.buildInfoService.getBuildInfo().subscribe(response => this.buildInfo = response);

  }

}
