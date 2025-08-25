import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasProductosEditarComponent } from './ventas-productos-editar.component';

describe('VentasProductosEditarComponent', () => {
  let component: VentasProductosEditarComponent;
  let fixture: ComponentFixture<VentasProductosEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasProductosEditarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasProductosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
