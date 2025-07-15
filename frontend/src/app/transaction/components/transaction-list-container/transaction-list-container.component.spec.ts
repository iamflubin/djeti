import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionListContainerComponent } from './transaction-list-container.component';

describe('TransactionListContainerComponent', () => {
  let component: TransactionListContainerComponent;
  let fixture: ComponentFixture<TransactionListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionListContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
