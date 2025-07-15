import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeadSortButtonComponent } from './table-head-sort-button.component';

describe('TableHeadSortButtonComponent', () => {
  let component: TableHeadSortButtonComponent;
  let fixture: ComponentFixture<TableHeadSortButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableHeadSortButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableHeadSortButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
