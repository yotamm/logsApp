import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef, OnDestroy,
  OnInit,
  Renderer2, ViewChild
} from '@angular/core';
import {BuildInfoService} from "../../services/build-info.service";
import {ActivatedRoute, ActivatedRouteSnapshot, ActivationEnd, Router} from "@angular/router";
import {filter, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {WebSocketSubject} from "rxjs/webSocket";
import {Step} from "../../models/Step.model";

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit, OnDestroy, AfterViewChecked {
  content: string[] = [];
  private stepId: Step['id'];
  private logStream$: WebSocketSubject<string>;
  private unsubscribe$ = new Subject<void>();

  @ViewChild("logRef") logRef: ElementRef;
  isStickyScrolling: boolean = true;

  constructor(private buildInfoService: BuildInfoService,
              private router: Router,
              private route: ActivatedRoute,
              private renderer: Renderer2,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  private handleLogUpdate(message) {
    if (message.stepId === this.stepId) {
      if (message.hasOwnProperty('line')) {
        const {line} = message;
        this.content.push(line);
        this.changeDetectorRef.detectChanges();
      } else if (message.hasOwnProperty('performed')) {
        const {performed} = message;
        this.content.push(...performed);
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  private getStepId(snapshot: ActivatedRouteSnapshot): number {
    return parseInt(snapshot.paramMap.get('stepId'));
  }

  toggleStickyScrolling() {this.isStickyScrolling = !this.isStickyScrolling;}

  ngOnInit(): void {
    this.logStream$ = this.buildInfoService.getLogStream();
    this.logStream$.pipe(takeUntil(this.unsubscribe$)).subscribe(this.handleLogUpdate.bind(this));
    this.stepId = this.getStepId(this.route.snapshot);
    this.buildInfoService.requestStepLog(this.stepId);

    this.router.events.pipe(takeUntil(this.unsubscribe$), filter(event => event instanceof ActivationEnd))
      .subscribe((event: ActivationEnd) => {
        const id = this.getStepId(event.snapshot);
        if (id !== null && !isNaN(id)) {
          this.stepId = id;
          this.content = [];
          this.buildInfoService.requestStepLog(this.stepId);
        }

      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewChecked(): void {
    if (this.isStickyScrolling && this.logRef) {
      const el = this.logRef.nativeElement;
      el.scrollTop = Math.max(0, el.scrollHeight - el.offsetHeight);
    }
  }
}
