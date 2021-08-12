import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { selectErrors } from './error-popup.reducer';
import { HttpError } from '../types/shared/error-popup/http-error.type';
import { NotifierService } from 'angular-notifier';
import { ErrorActionTypes } from './error-popup.actions';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorPopupComponent implements OnInit {

  @ViewChild('popupTemplate', { static: true })
  private template: TemplateRef<{ title: string, message: string }>;

  constructor(private store: Store<State>,
              private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.store.dispatch({ type: ErrorActionTypes.SCHEDULE_ERROR_DELETION });
    this.listenToErrorEvents();
  }

  private listenToErrorEvents(): void {
    this.store.select(selectErrors).subscribe((errors: HttpError[]) => {
      errors.filter(() => !document.hidden).forEach(error => {
        this.notifierService.show({
          type: 'error',
          title: error.title,
          message: error.message,
          template: this.template
        } as any);
      });
    });
  }
}
