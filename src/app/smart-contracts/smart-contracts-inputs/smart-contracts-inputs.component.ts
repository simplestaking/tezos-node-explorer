import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@app/app.reducers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SmartContract } from '@shared/types/smart-contracts/smart-contract.type';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SMART_CONTRACTS_RUN } from '@smart-contracts/smart-contracts/smart-contracts.actions';
import { filter } from 'rxjs/operators';
import { selectSmartContractsActiveContract } from '@smart-contracts/smart-contracts/smart-contracts.index';

@UntilDestroy()
@Component({
  selector: 'app-smart-contracts-inputs',
  templateUrl: './smart-contracts-inputs.component.html',
  styleUrls: ['./smart-contracts-inputs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartContractsInputsComponent implements OnInit {

  contract: SmartContract;
  formGroup: FormGroup;

  constructor(private store: Store<State>,
              private formBuilder: FormBuilder,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initForm();
    this.listenToActiveContractChanges();
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      parameter: new FormControl(),
      storage: new FormControl()
    });
  }

  private listenToActiveContractChanges(): void {
    this.store.select(selectSmartContractsActiveContract)
      .pipe(
        untilDestroyed(this),
        filter(Boolean)
      )
      .subscribe((contract: SmartContract) => {
        this.contract = contract;
        if (contract.code) {
          this.formGroup.get('storage').patchValue(contract.storage);
          this.formGroup.get('parameter').patchValue(contract.parameter);
        }
        this.cdRef.detectChanges();
      });
  }

  runContract(): void {
    this.store.dispatch({
      type: SMART_CONTRACTS_RUN,
      payload: {
        ...this.contract,
        codeParameter: [this.formGroup.get('storage').value, this.formGroup.get('parameter').value]
      }
    });
  }
}