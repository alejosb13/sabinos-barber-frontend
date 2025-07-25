import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoListComponent } from './saldo-list.component';

describe('SaldoListComponent', () => {
  let component: SaldoListComponent;
  let fixture: ComponentFixture<SaldoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaldoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
