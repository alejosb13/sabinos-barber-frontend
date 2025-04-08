import { EmpleadoCrudFormComponent } from 'src/app/shared/components/forms/empleado-crud-form/empleado-crud-form.component';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CardModule,
  ColorModeService,
  GridModule,
  SpinnerComponent,
} from '@coreui/angular';
import { Empleado } from 'src/app/models/Empleado.model';
import { EmpleadosService } from 'src/app/services/empleados.service';
import logger from 'src/app/shared/utils/logger';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-empleado-editar',
  standalone: true,
  imports: [
    CardModule,
    GridModule,
    EmpleadoCrudFormComponent,
    SpinnerComponent,
  ],
  templateUrl: './empleado-editar.component.html',
  styleUrl: './empleado-editar.component.scss',
})
export class EmpleadoEditarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _EmpleadosService = inject(EmpleadosService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;
  Id!: number;
  Empleado!: Empleado;

  ngOnInit(): void {
    this.Id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    this.getEmpleadoById();
  }

  FormsValues(Empleado: Empleado) {
    logger.log(Empleado);
    this._HelpersService.loaderSweetAlert({
      title: 'Actualizando Empleado',
      text: 'Esto puede demorar un momento.',
    });

    // this.loader = true;

    this._EmpleadosService
      .updateEmpleado(this.Id, Empleado)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data) => {
        this.loader = false;
        // console.log(data);
        this.Empleado = data.Empleado;
        Swal.mixin({
          customClass: {
            container: this.#colorModeService.getStoredTheme(
              environment.SabinosTheme
            ),
          },
        })
          .fire({
            text: 'Empleado modificado con éxito',
            icon: 'success',
          })
          .then((result) => {
            logger.log(result);
          });
      });
  }

  getEmpleadoById() {
    this._EmpleadosService
      .getEmpleadoById(this.Id)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Empleado) => {
        this.loader = false;
        this.Empleado = { ...data };
        logger.log(data);
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
