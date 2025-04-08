import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CardModule,
  ColorModeService,
  GridModule,
  SpinnerComponent,
} from '@coreui/angular';
import { Usuario } from 'src/app/models/Usuario.model';
import { UsuarioesService } from 'src/app/services/usuarios.service';
import logger from 'src/app/shared/utils/logger';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { UsuarioCrudFormComponent } from '../../../shared/components/forms/usuario-crud-form/usuario-crud-form.component';
import { catchError, Subject, takeUntil } from 'rxjs';
import { HelpersService } from '../../../services/helpers.service';

@Component({
  selector: 'app-usuario-editar',
  standalone: true,
  imports: [CardModule, GridModule, UsuarioCrudFormComponent, SpinnerComponent],
  templateUrl: './usuario-editar.component.html',
  styleUrl: './usuario-editar.component.scss',
})
export class UsuarioEditarComponent {
  private destruir$: Subject<void> = new Subject<void>();

  #colorModeService = inject(ColorModeService);
  private _UsuariosService = inject(UsuarioesService);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _HelpersService = inject(HelpersService);

  loader: boolean = true;
  Id!: number;
  Usuario!: Usuario;

  ngOnInit(): void {
    this.Id = Number(this._ActivatedRoute.snapshot.paramMap.get('id'));

    this.getUsuarioById();
  }

  FormsValues(Usuario: Usuario) {
    logger.log(Usuario);
    this._HelpersService.loaderSweetAlert({
      title: 'Actualizando usuario',
      text: 'Esto puede demorar un momento.',
    });

    // this.loader = true;

    this._UsuariosService
      .updateUsuario(this.Id, Usuario)
      .pipe(
        takeUntil(this.destruir$),
        catchError((error) =>
          this._HelpersService.handleErrorApiCrud(
            error,
            'No se pudo actualizar el usuario.'
          )
        )
      )
      .subscribe((data) => {
        this.loader = false;
        // console.log(data);
        this.Usuario = data.Usuario;
        Swal.mixin({
          customClass: {
            container: this.#colorModeService.getStoredTheme(
              environment.SabinosTheme
            ),
          },
        })
          .fire({
            text: 'Usuario modificado con éxito',
            icon: 'success',
          })
          .then((result) => {
            logger.log(result);
          });
      });
  }

  getUsuarioById() {
    this._UsuariosService
      .getUsuarioById(this.Id)
      .pipe(takeUntil(this.destruir$))
      .subscribe((data: Usuario) => {
        this.loader = false;
        this.Usuario = { ...data };
        logger.log(data);
      });
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
