import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTableActionsComponent } from './transaction-table-actions.component';

describe('TransactionTableActionsComponent', () => {
  let component: TransactionTableActionsComponent;
  let fixture: ComponentFixture<TransactionTableActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTableActionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionTableActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
