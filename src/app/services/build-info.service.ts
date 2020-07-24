import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {BuildMetaData} from "../models/BuildMetaData.model";
import {HttpClient} from "@angular/common/http";
import {WebSocketService} from "./web-socket.service";
import {WebSocketSubject} from "rxjs/webSocket";
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuildInfoService {
  private baseUrl = environment.beEndpoint;

  constructor(private http: HttpClient,
              private wsService: WebSocketService) {
  }

  getLogStream(): WebSocketSubject<string> {
    return this.wsService.getWebSocket();
  }

  requestStepLog(stepId: string): void {
    const jsonPayload = JSON.stringify({stepId: stepId});
    this.wsService.getWebSocket().next(jsonPayload);
  }

  getBuildInfo(): Observable<BuildMetaData> {
    const url = this.getFullUrl('steps');
    return this.http.get<BuildMetaData>(url);
  }

  private getFullUrl(url): string {
    return this.baseUrl + url;
  }
}
