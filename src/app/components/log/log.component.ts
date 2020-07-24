import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {BuildInfoService} from "../../services/build-info.service";
import {ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, Router} from "@angular/router";
import {filter, takeUntil} from "rxjs/operators";
import {Subject, Subscription} from "rxjs";
import {WebSocketSubject} from "rxjs/webSocket";

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit, OnDestroy {
  content: string[] = [];
  stepId: string;
  logStream$: WebSocketSubject<string>;
  unsubscribe$ = new Subject<void>();

  constructor(private buildInfoService: BuildInfoService,
              private router: Router,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef) { }

  private handleLogUpdate(newLine: string) {
    this.content.push(newLine);
    this.changeDetectorRef.detectChanges();
  }

  private getStepId(snapshot: ActivatedRouteSnapshot): string {
    return snapshot.paramMap.get('stepId');
  }

  ngOnInit(): void {
    this.logStream$ = this.buildInfoService.getLogStream();
    this.logStream$.pipe(takeUntil(this.unsubscribe$)).subscribe(this.handleLogUpdate);
    this.stepId = this.getStepId(this.route.snapshot);
    this.logStream$.next(this.stepId);

    this.router.events.pipe(takeUntil(this.unsubscribe$), filter(event => event instanceof ActivationEnd))
      .subscribe((event: ActivationEnd) => {
        this.stepId = this.getStepId(event.snapshot);
        this.logStream$.next(this.stepId);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
