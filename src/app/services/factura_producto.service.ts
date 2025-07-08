import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Factura } from '../models/Factura.model';
import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';

const URL_Factura = `${environment.apiUrl}factura_producto`;
export type FacturaResponse = Factura[] | Listado<Factura>;

@Injectable({
  providedIn: 'root',
})
export class FacturaProductoService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getFacturas(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_Factura;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getFacturaById(
    id: number,
    parametersURL?: ParametersUrl | null
  ): Observable<any> {
    const option: any = {
      responseType: 'json',
      ...(parametersURL && {
        params: this._Helpers.formatParameters(parametersURL),
      }),
    };

    // logger.log('URL', URL_Factura);
    return this.http.get<any>(`${URL_Factura}/${id}`, option);
  }

  deleteFacturaProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_Factura}/${id}`, {
      responseType: 'json',
    });
  }

  updateFacturaProducto(Id: number, Factura: any): Observable<any> {
    return this.http.put<any>(
      `${URL_Factura}/${Id}`,
      { ...Factura },
      {
        responseType: 'json',
      }
    );
  }

  createFacturaProducto(producto: any): Observable<any> {
    return this.http.post<Factura>(
      `${URL_Factura}`,
      { ...producto },
      {
        responseType: 'json',
      }
    );
  }
}
