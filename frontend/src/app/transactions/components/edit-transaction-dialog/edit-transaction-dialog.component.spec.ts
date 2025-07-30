import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTransactionDialogComponent } from './edit-transaction-dialog.component';

describe('EditTransactionDialogComponent', () => {
  let component: EditTransactionDialogComponent;
  let fixture: ComponentFixture<EditTransactionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTransactionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
