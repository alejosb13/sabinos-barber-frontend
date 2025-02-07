import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodoPagoListadoComponent } from './metodo-pago-listado.component';

describe('MetodoPagoListadoComponent', () => {
  let component: MetodoPagoListadoComponent;
  let fixture: ComponentFixture<MetodoPagoListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetodoPagoListadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetodoPagoListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
