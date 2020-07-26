import {Component, OnDestroy, OnInit} from '@angular/core';
import {BuildInfoService} from "../../services/build-info.service";
import {Step} from "../../models/Step.model";
import {Router} from "@angular/router";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  buildInfo: Step[];

  unsubscribe$ = new Subject<void>();

  constructor(private buildInfoService: BuildInfoService,
              private router: Router) { }

  requestRebuild() {
    this.buildInfoService.requestRebuild().pipe(takeUntil(this.unsubscribe$)).subscribe(response => {
      this.buildInfo = response;
      this.router.navigate(['/']);
    });
  }

  ngOnInit(): void {
    this.getBuildInfo();
    this.buildInfoService.getLogStream().pipe(takeUntil(this.unsubscribe$)).subscribe(message => {
      if (message.hasOwnProperty('statusUpdate')) {
        this.getBuildInfo();
      }
    });
  }

  getBuildInfo() {
    this.buildInfoService.getBuildInfo().pipe(takeUntil(this.unsubscribe$)).subscribe(response => this.buildInfo = response);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
