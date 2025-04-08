import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  ButtonDirective,
  ColComponent,
  ColorModeService,
  FormFloatingDirective,
  FormModule,
  FormSelectDirective,
  ModalModule,
  RowComponent,
} from '@coreui/angular';
import { SelectComponent } from 'src/app/documentacion/forms/select/select.component';
import { ProductoCrudFormBuilder } from './utils/form';
import { CommonModule } from '@angular/common';
import { ValidMessagesFormComponent } from '../../valid-messages-form/valid-messages-form.component';
import { ProductoCrudErrorMessages } from './utils/validations';
import Swal from 'sweetalert2';
import logger from 'src/app/shared/utils/logger';
import { environment } from 'src/environments/environment';
import { DirectivesModule } from '../../../directivas/directives.module';
import { Producto } from 'src/app/models/Producto.model';
import { LocalesService } from 'src/app/services/locales.service';
import { Local } from 'src/app/models/Local.model';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from '../../../../services/login.service';
import { ROLE_DATA } from '../../../utils/constants/user-roles';

@Component({
  selector: 'app-producto-crud-form',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    ButtonDirective,
    FormFloatingDirective,
    FormSelectDirective,
    FormModule,
    ReactiveFormsModule,
    ValidMessagesFormComponent,
    ModalModule,
    DirectivesModule,
  ],
  templateUrl: './producto-crud-form.component.html',
  styleUrl: './producto-crud-form.component.scss',
})
export class ProductoCrudFormComponent {
  private destruir$: Subject<void> = new Subject<void>();

  readonly ProductoCrudErrorMessages = ProductoCrudErrorMessages;
  ProductoCrudForm = ProductoCrudFormBuilder();
  #colorModeService = inject(ColorModeService);
  _LocalesServices = inject(LocalesService);
  _LoginService = inject(LoginService);

  @Input() Producto!: Producto;
  @Output() FormsValues = new EventEmitter<any>();

  LocalDataStorage!: Local;
  Locales: Local[] = [];

  constructor() {
    this.changeSesionStorage();
    this.formInit();
  }

  ngOnInit(): void {
    this.getLocales();

    if (!this._LoginService.isAdmin()) {
      this.ProductoCrudForm.controls.local_id.disable();
    }
  }
  ngOnChanges(): void {}

  changeSesionStorage() {
    effect(() => {
      this._LoginService.getUserData();
      this.formInit();
    });
  }

  formInit() {
    if (this.Producto) {
      this.setFormValues();
    } else {
      this.ProductoCrudForm.controls.local_id.patchValue(
        Number(this._LoginService.getUserData().local.id)
      );
    }
  }

  getLocales() {
    this._LocalesServices
      .getLocales({ disablePaginate: '1', link: null })
      .pipe(takeUntil(this.destruir$))
      .subscribe((locales: Local[]) => {
        this.Locales = locales;
      });
  }

  getControlError(name: string): ValidationErrors | null {
    const control = this.ProductoCrudForm.controls
      ? this.ProductoCrudForm.get(name)
      : null;

    return control && control.touched && control.invalid
      ? control.errors
      : null;
  }

  getControl(name: string): FormControl {
    return this.ProductoCrudForm.get(name) as FormControl;
  }

  setFormValues() {
    logger.log(this.Producto);

    this.ProductoCrudForm.patchValue({
      marca: this.Producto.marca,
      cantidad: this.Producto.cantidad,
      descripcion: this.Producto.descripcion,
      local_id: this.Producto.local_id,
      precio: this.Producto.precio,
      // ilimitado: this.Producto.ilimitado == 1 ? true : false,
    });
  }

  sendValueFom() {
    if (this.ProductoCrudForm.valid) {
      const FORM_VALUE = {
        ...this.ProductoCrudForm.value,
        // ilimitado: this.ProductoCrudForm.value.ilimitado ? 1 : 0,
        local_id: this.ProductoCrudForm.get('local_id')?.value,
      };

      this.FormsValues.emit(FORM_VALUE);
    } else {
      Swal.mixin({
        customClass: {
          container: this.#colorModeService.getStoredTheme(
            environment.SabinosTheme
          ),
        },
      }).fire({
        text: 'Complete todos los campos obligatorios',
        icon: 'warning',
      });
    }
  }

  ngOnDestroy(): void {
    // Completa el Subject para cancelar todas las suscripciones activas
    this.destruir$.next();
    this.destruir$.complete();
  }
}
