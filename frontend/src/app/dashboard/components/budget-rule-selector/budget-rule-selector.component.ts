import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { BudgetRule } from '../../models';
import { BUDGET_RULE_VALIDATOR } from './budget-rule.validator';

@Component({
  selector: 'app-budget-rule-selector',
  imports: [ReactiveFormsModule, HlmLabelDirective, HlmInputDirective],
  templateUrl: './budget-rule-selector.component.html',
  styleUrl: './budget-rule-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetRuleSelectorComponent implements OnInit {
  initialRule = input<BudgetRule>();
  ruleChange = output<BudgetRule>();

  protected readonly fb = inject(NonNullableFormBuilder);

  protected readonly form = this.fb.group(
    {
      needs: [50, Validators.required],
      wants: [30, Validators.required],
      savings: [20, Validators.required],
    },
    { validators: BUDGET_RULE_VALIDATOR }
  );

  private readonly destroyRef = inject(DestroyRef);

  get customClass() {
    return {
      'border-destructive': this.form.invalid && this.form.touched,
    };
  }

  ngOnInit() {
    this.initValues();
    this.form.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
        debounceTime(200)
      )
      .subscribe(() => {
        if (this.form.valid) {
          const value = this.form.getRawValue();
          this.ruleChange.emit(value);
        }
      });
  }

  private initValues() {
    const intialValues = this.initialRule();
    if (intialValues) {
      this.form.patchValue(intialValues);
    }
  }
}
