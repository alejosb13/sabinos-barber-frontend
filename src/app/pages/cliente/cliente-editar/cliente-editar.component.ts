import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule, ColorModeService, GridModule } from '@coreui/angular';
import { Cliente } from 'src/app/models/Cliente.model';
import { ClientesService } from 'src/app/services/clientes.service';
import logger from 'src/app/shared/utils/logger';
import { ClienteCrudFormComponent } from '../../../shared/components/forms/cliente-crud-form/cliente-crud-form.component';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cliente-editar',
  standalone: true,
  templateUrl: './cliente-editar.component.html',
  styleUrl: './cliente-editar.component.scss',
  imports: [CardModule, GridModule, ClienteCrudFormComponent],
})
export class ClienteEditarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _ClientesService = inject(ClientesService);
  private _ActivatedRoute = inject(ActivatedRoute);

  loader: boolean = true;
  Id!: number;
  Cliente!: Cliente;

  ngOnInit(): void {
    this.Id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    this.getClienteById();
  }

  FormsValues(Cliente: Cliente) {
    logger.log(Cliente);

    Swal.mixin({
      customClass: {
        container: this.#colorModeService.getStoredTheme(
          environment.SabinosTheme
        ),
      },
    }).fire({
      title: 'Actualizando Cliente',
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
    this.loader = true;

    this._ClientesService.updateCliente(this.Id, Cliente).subscribe((data) => {
      this.loader = false;
      // console.log(data);
      this.Cliente = data.Cliente;
      Swal.mixin({
        customClass: {
          container: this.#colorModeService.getStoredTheme(
            environment.SabinosTheme
          ),
        },
      })
        .fire({
          text: 'Cliente modificado con éxito',
          icon: 'success',
        })
        .then((result) => {
          console.log(result);
        });
    });
  }

  getClienteById() {
    this._ClientesService
      .getClienteById(this.Id)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Cliente) => {
        this.loader = false;
        this.Cliente = { ...data };
        console.log(data);
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
