import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoCrudFormComponent } from './saldo-crud-form.component';

describe('SaldoCrudFormComponent', () => {
  let component: SaldoCrudFormComponent;
  let fixture: ComponentFixture<SaldoCrudFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaldoCrudFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldoCrudFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
