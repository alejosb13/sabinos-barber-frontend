import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasProductosInsertarComponent } from './ventas-productos-insertar.component';

describe('VentasProductosInsertarComponent', () => {
  let component: VentasProductosInsertarComponent;
  let fixture: ComponentFixture<VentasProductosInsertarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasProductosInsertarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasProductosInsertarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
