import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasProductosListadoComponent } from './ventas-productos-listado.component';

describe('VentasProductosListadoComponent', () => {
  let component: VentasProductosListadoComponent;
  let fixture: ComponentFixture<VentasProductosListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasProductosListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasProductosListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
