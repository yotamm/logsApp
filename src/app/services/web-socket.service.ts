import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  //TODO err handling
  private WS_ENDPOINT = environment.wsEndpoint;
  private socket$: WebSocketSubject<string>;

  private connect(): void {
    if (!this.socket$) {
      this.socket$ = webSocket<string>(this.WS_ENDPOINT);
    }
  }

  getWebSocket(): WebSocketSubject<any> {
    this.connect();
    return this.socket$;
  }
}
