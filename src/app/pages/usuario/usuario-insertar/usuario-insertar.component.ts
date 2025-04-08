import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule, ColorModeService, GridModule } from '@coreui/angular';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioesService } from 'src/app/services/usuarios.service';
import logger from 'src/app/shared/utils/logger';

import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { UsuarioCrudFormComponent } from '../../../shared/components/forms/usuario-crud-form/usuario-crud-form.component';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-usuario-insertar',
  standalone: true,
  imports: [CardModule, GridModule, UsuarioCrudFormComponent],
  templateUrl: './usuario-insertar.component.html',
  styleUrl: './usuario-insertar.component.scss',
})
export class UsuarioInsertarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _UsuarioesService = inject(UsuarioesService);
  private _HelpersService = inject(HelpersService);
  private _Router = inject(Router);

  loader: boolean = true;

  FormsValues(Usuario: Usuario) {
    logger.log(Usuario);
    this._HelpersService.loaderSweetAlert({
      title: 'Agregando usuario',
      text: 'Esto puede demorar un momento.',
    });

    this._UsuarioesService
      .createUsuario(Usuario)
      .pipe(
        takeUntil(this.destruir$),
        catchError((error) => {
          logger.log('error', error);
          this._HelpersService.handleErrorApiCrud(
            error,
            'No se pudo insertar el usuario.'
          );
          return throwError(() => error);
        })
      )
      .subscribe((data) => {
        this.loader = false;
        logger.log(data);
        this._HelpersService.handleErrorApiCrud(data);
        Swal.mixin({
          customClass: {
            container: this.#colorModeService.getStoredTheme(
              environment.SabinosTheme
            ),
          },
        })
          .fire({
            text: 'Usuario agregado con éxito',
            icon: 'success',
          })
          .then((result) => {
            this._Router.navigateByUrl(`/usuarios`);
            // this._Router.navigateByUrl(`/usuarios/editar/${data.id}`);
          });
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
