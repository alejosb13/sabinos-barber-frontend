import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleGastosModalComponent } from './detalle-gastos-modal.component';

describe('DetalleGastosModalComponent', () => {
  let component: DetalleGastosModalComponent;
  let fixture: ComponentFixture<DetalleGastosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleGastosModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleGastosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
