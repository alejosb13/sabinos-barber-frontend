import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasProductoDetalleComponent } from './ventas-producto-detalle.component';

describe('VentasProductoDetalleComponent', () => {
  let component: VentasProductoDetalleComponent;
  let fixture: ComponentFixture<VentasProductoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasProductoDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasProductoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
