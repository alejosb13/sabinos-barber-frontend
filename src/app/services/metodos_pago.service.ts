import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';
import { MetodoPago } from '../models/MetodoPago.model';

const URL_Metodo_Pago = `${environment.apiUrl}metodo_pago`;
export type Metodo_Pago_Response = MetodoPago[] | Listado<MetodoPago>;

@Injectable({
  providedIn: 'root',
})
export class MetodoPagoService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getMetodoPago(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_Metodo_Pago;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getMetodoPagoById(id: number): Observable<any> {
    return this.http.get<any>(`${URL_Metodo_Pago}/${id}`, {
      responseType: 'json',
    });
  }

  deleteMetodoPago(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_Metodo_Pago}/${id}`, {
      responseType: 'json',
    });
  }

  updateMetodoPago(Id: number, MetodoPago: MetodoPago): Observable<any> {
    return this.http.put<MetodoPago>(
      `${URL_Metodo_Pago}/${Id}`,
      { ...MetodoPago },
      {
        responseType: 'json',
      }
    );
  }

  createMetodoPago(MetodoPago: MetodoPago): Observable<any> {
    return this.http.post<MetodoPago>(
      `${URL_Metodo_Pago}`,
      { ...MetodoPago },
      {
        responseType: 'json',
      }
    );
  }
}
