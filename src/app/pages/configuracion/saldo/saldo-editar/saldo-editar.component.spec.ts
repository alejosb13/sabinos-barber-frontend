import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoEditarComponent } from './saldo-editar.component';

describe('SaldoEditarComponent', () => {
  let component: SaldoEditarComponent;
  let fixture: ComponentFixture<SaldoEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaldoEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
