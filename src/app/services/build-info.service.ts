import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {BuildMetaData} from "../models/BuildMetaData.model";
import {HttpClient} from "@angular/common/http";
import {WebSocketService} from "./web-socket.service";
import {WebSocketSubject} from "rxjs/webSocket";
import {environment} from '../../environments/environment';
import {Step} from "../models/Step.model";

@Injectable({
  providedIn: 'root'
})
export class BuildInfoService {
  private baseUrl = environment.beEndpoint;

  constructor(private http: HttpClient,
              private wsService: WebSocketService) {
  }

  getLogStream(): WebSocketSubject<any> {
    return this.wsService.getWebSocket();
  }

  requestStepLog(stepId: string): void {
    this.wsService.getWebSocket().next({stepId: stepId});
  }

  getBuildInfo(): Observable<Step[]> {
    const url = this.getFullUrl('build-info');
    return this.http.get<any>(url);
  }

  private getFullUrl(url): string {
    return this.baseUrl + url;
  }
}
