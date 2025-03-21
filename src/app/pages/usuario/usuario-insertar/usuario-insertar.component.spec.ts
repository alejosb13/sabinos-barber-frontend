import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioInsertarComponent } from './usuario-insertar.component';

describe('UsuarioInsertarComponent', () => {
  let component: UsuarioInsertarComponent;
  let fixture: ComponentFixture<UsuarioInsertarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioInsertarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioInsertarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
