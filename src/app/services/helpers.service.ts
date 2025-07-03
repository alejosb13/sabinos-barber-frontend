import { inject, Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { ParametersUrl } from '../models/Parameter.model';
import { Filtro } from '../models/Filter.model';
import { ColorModeService } from '@coreui/angular';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';
import logger from '../shared/utils/logger';
import moment, { Moment, MomentInput } from 'moment';

const URL_PRODUCTO = `${environment.apiUrl}productos`;
@Injectable({
  providedIn: 'root',
})
export class HelpersService {
  readonly #ColorModeService = inject(ColorModeService);

  headerJson_Token(): HttpHeaders {
    let config = {
      'Content-Type': 'application/json',
    };

    return new HttpHeaders(config);
  }

  // public methods
  formatParameters(parametersURL: ParametersUrl): HttpParams {
    let params = new HttpParams();
    Object.entries(parametersURL).forEach(([key, value]) => {
      // logger.log([key, value]);
      // Solo agregar valores que no sean undefined o null
      if ((value && key != 'link') || key === 'estado') {
        params = params.set(key, value);
      }
    });
    return params;
  }

  filterData(filtros: Filtro): Filtro {
    const newFiltros = Object.entries(filtros)
      .filter(([key, value]) => this.excludeInFilter(key, value, filtros)) // Pasar el objeto completo para procesar fecha
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    return newFiltros as Filtro;
  }

  private excludeInFilter(key: string, value: any, filtros: Filtro): boolean {
    const exclusionRules: Record<string, any> = {
      estado: 2,
      local_id: 0,
    };

    // filtro la fecha
    if (key === 'fecha') {
      // if (key === 'fecha' && filtros.fecha?.startDate && filtros.fecha?.endDate) {
      // filtros.dateIni = dayjs(filtros.fecha.startDate).format('YYYY-MM-DD');
      // filtros.dateFin = dayjs(filtros.fecha.endDate).format('YYYY-MM-DD');
      return false; // Excluir el campo `fecha`
    }

    // Excluir claves según las reglas definidas
    if (exclusionRules[key] !== undefined && value === exclusionRules[key]) {
      return false;
    }

    // Incluir claves con valores no vacíos
    return value !== '';
  }

  loaderSweetAlert({ title, text }: { title: string; text: string }) {
    Swal.mixin({
      customClass: {
        container: this.#ColorModeService.getStoredTheme(
          environment.SabinosTheme
        ),
      },
    }).fire({
      title,
      text,
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      // allowEnterKey: false,
      focusConfirm: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  idAleatorio() {
    const timestamp = Date.now().toString(); // Fecha en milisegundos
    const uuid = uuidv4().replace(/\D/g, ''); // Genera UUID y elimina caracteres no numéricos
    return Number(timestamp + uuid.substring(0, 6)); // Toma los primeros 6 números del UUID
  }

  handleErrorApiCrud(
    httpErrorResponse: HttpErrorResponse,
    mensaje = 'Hubo un error en la operación. Inténtalo de nuevo.'
  ) {
    let ListErrorStr: string = '';

    if (httpErrorResponse.error.length > 0) {
      logger.log('asasfas');
      let listError: any[] = [];
      ListErrorStr += "<ul class='error-list'>";

      httpErrorResponse.error.map((value: any) =>
        listError.push(Object.values(value)[0])
      );
      listError.map((msjError) => (ListErrorStr += `<li>${msjError}</li>`));

      ListErrorStr += '</ul>';
    } else if (httpErrorResponse.error.mensaje) {
      ListErrorStr = mensaje;
    } else {
      ListErrorStr += httpErrorResponse.error;
    }

    ListErrorStr = ListErrorStr ? ListErrorStr : mensaje;

    Swal.mixin({
      customClass: {
        container: this.#ColorModeService.getStoredTheme(
          environment.SabinosTheme
        ),
      },
    })
      .fire({
        title: '¡Error!',
        html: ListErrorStr,
        icon: 'error',
      })
      .then((result) => {
        logger.log(result);
      });

    return throwError(() => httpErrorResponse);
  }

  IMoment(date: MomentInput = null, format: string | [] | null = null): Moment {
    return date ? (format ? moment(date, format) : moment(date)) : moment();
  }
}
