import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule, ColorModeService, GridModule } from '@coreui/angular';
import logger from 'src/app/shared/utils/logger';

import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
// import { EmpleadoCrudFormComponent } from '../../../shared/components/forms/empleado-crud-form/empleado-crud-form.component';
import { Subject, takeUntil } from 'rxjs';
import { HelpersService } from '../../../../services/helpers.service';
import { Saldo } from '../../../../models/Saldo.model';
import { SaldoService } from '../../../../services/saldo.service';
import { SaldoCrudFormComponent } from '../../../../shared/components/forms/saldo-crud-form/saldo-crud-form.component';

@Component({
  selector: 'app-saldo-insertar',
  standalone: true,
  imports: [CardModule, GridModule, SaldoCrudFormComponent],
  templateUrl: './saldo-insertar.component.html',
  styleUrl: './saldo-insertar.component.scss',
})
export class SaldoInsertarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _SaldoService = inject(SaldoService);
  private _Router = inject(Router);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this._Router.navigateByUrl(`/ajustes/metodo-pago/editar/6`);
  }
  FormsValues(saldo: Saldo) {
    logger.log('saldo form', saldo);
    this._HelpersService.loaderSweetAlert({
      title: 'Agregando saldo',
      text: 'Esto puede demorar un momento.',
    });

    this._SaldoService
      .createSaldo(saldo)
      .pipe(takeUntil(this.destruir$))
      .subscribe((response) => {
        this.loader = false;
        logger.log(response);
        Swal.mixin({
          customClass: {
            container: this.#colorModeService.getStoredTheme(
              environment.SabinosTheme
            ),
          },
        })
          .fire({
            text: 'Saldo agregado con éxito',
            icon: 'success',
          })
          .then((result) => {
            // this._Router.navigateByUrl(
            //   `/ajustes/metodo-pago/editar/${response.id}`
            // );
            this._Router.navigateByUrl(`/ajustes/saldos`);
          });
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
