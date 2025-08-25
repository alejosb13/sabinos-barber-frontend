import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';
import { Venta } from '../models/Venta.model';

const URL_VENTA = `${environment.apiUrl}ventas`;

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getVentas(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_VENTA;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getVentasById(
    id: number,
    parametersURL?: ParametersUrl | null
  ): Observable<any> {
    const option: any = {
      responseType: 'json',
      ...(parametersURL && {
        params: this._Helpers.formatParameters(parametersURL),
      }),
    };

    // logger.log('URL', URL_Gasto);
    return this.http.get<any>(`${URL_VENTA}/${id}`, option);
  }

  updateVentas(Id: number, Ventas: Venta): Observable<any> {
    return this.http.put<Venta>(
      `${URL_VENTA}/${Id}`,
      { ...Ventas },
      {
        responseType: 'json',
      }
    );
  }

  createVenta(venta: Venta): Observable<any> {
    return this.http.post<Venta>(
      `${URL_VENTA}`,
      { ...venta },
      {
        responseType: 'json',
      }
    );
  }

  deleteVenta(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_VENTA}/${id}`, {
      responseType: 'json',
    });
  }
}
