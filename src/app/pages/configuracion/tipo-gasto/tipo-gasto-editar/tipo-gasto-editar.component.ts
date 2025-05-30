import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CardModule,
  ColorModeService,
  GridModule,
  SpinnerComponent,
} from '@coreui/angular';
import logger from 'src/app/shared/utils/logger';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';
import { HelpersService } from '../../../../services/helpers.service';
import { MetodoPago } from '../../../../models/MetodoPago.model';
import { TipoGasto } from '../../../../models/TipoGasto.model';
import { TipoGastoService } from '../../../../services/tipo_gasto.service';
import { TipoGastoCrudFormComponent } from '../../../../shared/components/forms/tipo-gasto-crud-form/tipo-gasto-crud-form.component';

@Component({
  selector: 'app-tipo-gasto-editar',
  standalone: true,
  imports: [
    CardModule,
    GridModule,
    SpinnerComponent,
    TipoGastoCrudFormComponent,
  ],
  templateUrl: './tipo-gasto-editar.component.html',
  styleUrl: './tipo-gasto-editar.component.scss',
})
export class TipoGastoEditarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _TipoGastoService = inject(TipoGastoService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;
  Id!: number;
  TipoGasto!: TipoGasto;

  ngOnInit(): void {
    this.Id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    this.getEmpleadoById();
  }

  FormsValues(TipoGasto: TipoGasto) {
    logger.log(TipoGasto);
    this._HelpersService.loaderSweetAlert({
      title: 'Actualizando tipo de gasto',
      text: 'Esto puede demorar un momento.',
    });

    // this.loader = true;

    this._TipoGastoService
      .updateTipoGasto(this.Id, TipoGasto)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data) => {
        this.loader = false;
        // console.log(data);
        this.TipoGasto = data.Empleado;
        Swal.mixin({
          customClass: {
            container: this.#colorModeService.getStoredTheme(
              environment.SabinosTheme
            ),
          },
        })
          .fire({
            text: 'Tipo de gasto modificado con éxito',
            icon: 'success',
          })
          .then((result) => {
            logger.log(result);
          });
      });
  }

  getEmpleadoById() {
    this._TipoGastoService
      .getTipoGastoById(this.Id)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: MetodoPago) => {
        this.loader = false;
        this.TipoGasto = { ...data };
        logger.log(data);
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
