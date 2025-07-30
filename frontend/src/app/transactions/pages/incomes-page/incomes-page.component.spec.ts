import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomesPageComponent } from './incomes-page.component';

describe('IncomesPageComponent', () => {
  let component: IncomesPageComponent;
  let fixture: ComponentFixture<IncomesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
