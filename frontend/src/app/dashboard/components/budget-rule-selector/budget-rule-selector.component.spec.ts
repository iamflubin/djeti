import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetRuleSelectorComponent } from './budget-rule-selector.component';

describe('BudgetRuleSelectorComponent', () => {
  let component: BudgetRuleSelectorComponent;
  let fixture: ComponentFixture<BudgetRuleSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetRuleSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BudgetRuleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
