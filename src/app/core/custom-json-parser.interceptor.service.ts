import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const TRACKING_URL = '/dev/shell/automaton/actions';

@Injectable({ providedIn: 'root' })
export class CustomJsonParserInterceptorService implements HttpInterceptor {

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return httpRequest.responseType === 'json' && httpRequest.url.includes(TRACKING_URL)
      ? this.handleJsonResponses(httpRequest, next)
      : next.handle(httpRequest);
  }

  private handleJsonResponses(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(httpRequest.clone({ responseType: 'text' }))
      .pipe(map(event => this.parseResponse(event)));
  }

  private parseResponse(event: HttpEvent<any>): HttpEvent<any> {
    return event instanceof HttpResponse
      ? event.clone({ body: this.getParsedBody(event) })
      : event;
  }

  private getParsedBody(event: HttpResponse<any>): any {
    const bodyWithEscapedLargeNumbers = event.body.replace(/([\[:])?(\d{17}|\d{19})([,\}\]])/g, '$1"$2"$3');
    return JSON.parse(bodyWithEscapedLargeNumbers);
  }
}