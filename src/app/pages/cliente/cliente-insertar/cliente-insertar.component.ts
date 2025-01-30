import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule, ColorModeService, GridModule } from '@coreui/angular';
import { Cliente } from 'src/app/models/Cliente.model';
import { ClientesService } from 'src/app/services/clientes.service';
import logger from 'src/app/shared/utils/logger';

import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ClienteCrudFormComponent } from '../../../shared/components/forms/cliente-crud-form/cliente-crud-form.component';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-cliente-insertar',
  standalone: true,
  templateUrl: './cliente-insertar.component.html',
  styleUrl: './cliente-insertar.component.scss',
  imports: [CardModule, GridModule, ClienteCrudFormComponent],
})
export class ClienteInsertarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _ClientesService = inject(ClientesService);
  private _Router = inject(Router);

  loader: boolean = true;

  FormsValues(Cliente: Cliente) {
    logger.log(Cliente);

    Swal.mixin({
      customClass: {
        container: this.#colorModeService.getStoredTheme(
          environment.SabinosTheme
        ),
      },
    }).fire({
      title: 'Agregando Cliente',
      text: 'Esto puede demorar un momento.',
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      // allowEnterKey: false,
      focusConfirm: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this._ClientesService
      .createCliente(Cliente)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data) => {
        this.loader = false;
        console.log(data);
        Swal.mixin({
          customClass: {
            container: this.#colorModeService.getStoredTheme(
              environment.SabinosTheme
            ),
          },
        })
          .fire({
            text: 'Cliente agregado con éxito',
            icon: 'success',
          })
          .then((result) => {
            this._Router.navigateByUrl(`/clientes/editar/${data.id}`);
          });
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
