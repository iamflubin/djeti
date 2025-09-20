import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpensesPieChartComponent } from './expenses-pie-chart.component';

describe('ExpensesPieChartComponent', () => {
  let component: ExpensesPieChartComponent;
  let fixture: ComponentFixture<ExpensesPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpensesPieChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
