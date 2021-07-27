import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { systemResourcesPanel } from '../resources/resources.reducer';
import { SystemResourcesPanel, SystemResourcesSortBy } from '@shared/types/resources/system/system-resources-panel.type';
import { Observable } from 'rxjs';
import { SystemResourcesActionTypes, SystemResourcesSortAction } from '../system-resources/system-resources.actions';

@Component({
  selector: 'app-system-resources-panel',
  templateUrl: './system-resources-panel.component.html',
  styleUrls: ['./system-resources-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemResourcesPanelComponent implements OnInit {

  @Input() colors: string[];

  resource$: Observable<SystemResourcesPanel>;

  constructor(private store: Store<State>) { }

  ngOnInit(): void {
    this.resource$ = this.store.select(systemResourcesPanel);
  }

  sort(sortBy: SystemResourcesSortBy, currentSort: SystemResourcesSortBy): void {
    if (sortBy === currentSort) {
      return;
    }
    this.store.dispatch<SystemResourcesSortAction>({
      type: SystemResourcesActionTypes.SYSTEM_RESOURCES_SORT,
      payload: { sortBy }
    });
  }
}
