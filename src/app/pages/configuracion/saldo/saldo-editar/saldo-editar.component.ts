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
import { MetodoPagoCrudFormComponent } from '../../../../shared/components/forms/metodo-pago-crud-form/metodo-pago-crud-form.component';
import { MetodoPagoService } from '../../../../services/metodos_pago.service';
import { MetodoPago } from '../../../../models/MetodoPago.model';
import { Saldo } from '../../../../models/Saldo.model';
import { SaldoService } from '../../../../services/saldo.service';
import { SaldoCrudFormComponent } from '../../../../shared/components/forms/saldo-crud-form/saldo-crud-form.component';

@Component({
  selector: 'app-saldo-editar',
  standalone: true,
  imports: [CardModule, GridModule, SpinnerComponent, SaldoCrudFormComponent],
  templateUrl: './saldo-editar.component.html',
  styleUrl: './saldo-editar.component.scss',
})
export class SaldoEditarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _MetodoPagoService = inject(MetodoPagoService);
  private _SaldoService = inject(SaldoService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;
  Id!: number;
  Saldo!: Saldo;
  MetodosPago!: MetodoPago[];

  ngOnInit(): void {
    this.Id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    this.getSaldoById();
  }

  FormsValues(saldo: Saldo) {
    logger.log(saldo);
    this._HelpersService.loaderSweetAlert({
      title: 'Actualizando saldo',
      text: 'Esto puede demorar un momento.',
    });

    // this.loader = true;

    this._SaldoService
      .updateSaldo(this.Id, saldo)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data) => {
        this.loader = false;
        // console.log(data);
        this.MetodosPago = data.Empleado;
        Swal.mixin({
          customClass: {
            container: this.#colorModeService.getStoredTheme(
              environment.SabinosTheme
            ),
          },
        })
          .fire({
            text: 'Método de pago modificado con éxito',
            icon: 'success',
          })
          .then((result) => {
            logger.log(result);
          });
      });
  }

  getSaldoById() {
    this._SaldoService
      .getSaldoById(this.Id)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Saldo) => {
        this.loader = false;
        this.Saldo = { ...data };
        logger.log(data);
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
