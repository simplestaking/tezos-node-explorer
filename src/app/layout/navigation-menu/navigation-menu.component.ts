import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../app.reducers';
import { Router } from '@angular/router';
import { SettingsNode } from '../../shared/types/settings-node/settings-node.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { App } from '../../shared/types/app/app.type';
import { selectFeatures } from '../../settings/settings-node/settings-node.reducer';
import { appState } from '../../app.reducer';

@UntilDestroy()
@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationMenuComponent implements OnInit, AfterViewInit {

  app: App;
  settingsNode: SettingsNode;
  appFeatures$: Observable<{ [p: string]: string }>;

  haveResources: boolean;
  haveExplorer: boolean;
  haveSandbox: boolean;
  haveDebugger: boolean;

  constructor(private store: Store<State>,
              private router: Router) { }

  ngOnInit(): void {
    this.getAppState();
    this.getNodeState();
    this.getFeatures();
  }

  private getAppState(): void {
    this.store.select(appState)
      .pipe(untilDestroyed(this))
      .subscribe(state => this.app = state);
  }

  private getNodeState(): void {
    this.store.select('settingsNode')
      .pipe(untilDestroyed(this))
      .subscribe(node => {
        this.haveDebugger = node.activeNode.features.some(f => f.name === 'debugger');
        this.settingsNode = node;
      });
  }

  private getFeatures(): void {
    this.appFeatures$ = this.store.select(selectFeatures).pipe(
      untilDestroyed(this),
      map((featuresArray: any[]) => {
        const features = {};
        featuresArray.forEach(feature => features[feature.name] = feature);
        this.haveResources = features['resources/system'] || features['resources/storage'] || features['resources/memory'];
        this.haveExplorer = features['network'] || features['storage'] || features['mempool'] || features['logs'] || features['endpoints'];
        this.haveSandbox = features['chains'] || features['wallets'] || features['sandbox'];
        return features;
      }),
    );
  }

  ngAfterViewInit(): void {
    this.closeMenu();
  }

  closeMenu(): void {
    if (this.app.sidenav.mode === 'over') {
      this.store.dispatch({ type: 'APP_TOGGLE_SIDENAV', payload: { isVisible: false } });
    }
  }

  toggleMenuSize(): void {
    this.store.dispatch({
      type: 'APP_MENU_SIZE_CHANGE',
      payload: { collapsed: !this.app.sidenav.collapsed }
    });
  }

  addSandboxNode(): void {
    this.router.navigate(['/sandbox']);
  }

  stopSandboxNode(): void {
    this.store.dispatch({
      type: 'SANDBOX_NODE_STOP',
      payload: '',
    });
  }

  // sandboxBakeBlock(): void {
  //   if (this.app.statusbar.sandbox) {
  //     this.store.dispatch({
  //       type: 'SANDBOX_BAKE_BLOCK',
  //     });
  //   }
  // }
}
