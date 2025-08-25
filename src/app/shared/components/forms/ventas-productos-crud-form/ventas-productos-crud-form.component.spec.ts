import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasProductosCrudFormComponent } from './ventas-productos-crud-form.component';

describe('VentasProductosCrudFormComponent', () => {
  let component: VentasProductosCrudFormComponent;
  let fixture: ComponentFixture<VentasProductosCrudFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasProductosCrudFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasProductosCrudFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
