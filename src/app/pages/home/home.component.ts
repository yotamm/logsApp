import {Component, OnDestroy, OnInit} from '@angular/core';
import {BuildInfoService} from "../../services/build-info.service";
import {Step} from "../../models/Step.model";
import {NavigationEnd, Router} from "@angular/router";
import {Subject} from "rxjs";
import {filter, takeUntil} from "rxjs/operators";
import {Status} from "../../models/Status.enum";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  buildInfo: Step[];

  unsubscribe$ = new Subject<void>();

  constructor(private buildInfoService: BuildInfoService,
              private router: Router) {
  }

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
        const callback = (response) => {
          this.buildInfo = response;
          this.navigateToLatestRunningBuildStep();
        };
        this.getBuildInfo(callback);
      }
    });

    this.router.events.pipe(takeUntil(this.unsubscribe$), filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.getBuildInfo();
      });
  }

  private getBuildInfo(callback?: (response) => void) {
    const nextHandler = callback ? callback : (response => this.buildInfo = response);
    this.buildInfoService.getBuildInfo().pipe(takeUntil(this.unsubscribe$)).subscribe(nextHandler);
  }

  private navigateToLatestRunningBuildStep() {
    const stepToMoveTo = this.buildInfo.reduce(((previousValue, currentValue) => {
      return currentValue.status === Status.inProgress ? currentValue : previousValue;
    }));
    this.router.navigate(['build', `${stepToMoveTo.id}`]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
