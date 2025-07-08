import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';
import { TipoGasto } from '../models/TipoGasto.model';

const URL_Tipos_Gasto = `${environment.apiUrl}tipo_gasto`;
export type Metodo_Pago_Response = TipoGasto[] | Listado<TipoGasto>;

@Injectable({
  providedIn: 'root',
})
export class TipoGastoService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getTipoGasto(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_Tipos_Gasto;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getTipoGastoById(id: number): Observable<any> {
    return this.http.get<any>(`${URL_Tipos_Gasto}/${id}`, {
      responseType: 'json',
    });
  }

  deleteTipoGasto(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_Tipos_Gasto}/${id}`, {
      responseType: 'json',
    });
  }

  updateTipoGasto(Id: number, TipoGasto: TipoGasto): Observable<any> {
    return this.http.put<TipoGasto>(
      `${URL_Tipos_Gasto}/${Id}`,
      { ...TipoGasto },
      {
        responseType: 'json',
      }
    );
  }

  createTipoGasto(TipoGasto: TipoGasto): Observable<any> {
    return this.http.post<TipoGasto>(
      `${URL_Tipos_Gasto}`,
      { ...TipoGasto },
      {
        responseType: 'json',
      }
    );
  }
}
