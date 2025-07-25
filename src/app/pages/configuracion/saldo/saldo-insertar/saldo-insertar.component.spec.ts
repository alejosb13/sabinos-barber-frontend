import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoInsertarComponent } from './saldo-insertar.component';

describe('SaldoInsertarComponent', () => {
  let component: SaldoInsertarComponent;
  let fixture: ComponentFixture<SaldoInsertarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaldoInsertarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldoInsertarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
