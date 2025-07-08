import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Servicios } from '../models/Servicios.model';
import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';

const URL_Servicio = `${environment.apiUrl}servicio`;

@Injectable({
  providedIn: 'root',
})
export class ServicioService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getServicios(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_Servicio;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getServicioById(
    id: number,
    parametersURL?: ParametersUrl | null
  ): Observable<any> {
    const option: any = {
      responseType: 'json',
      ...(parametersURL && {
        params: this._Helpers.formatParameters(parametersURL),
      }),
    };

    // logger.log('URL', URL_Servicio);
    return this.http.get<any>(`${URL_Servicio}/${id}`, option);
  }

  deleteServicio(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_Servicio}/${id}`, {
      responseType: 'json',
    });
  }

  updateServicio(Id: number, Servicio: Servicios): Observable<any> {
    return this.http.put<Servicios>(
      `${URL_Servicio}/${Id}`,
      { ...Servicio },
      {
        responseType: 'json',
      }
    );
  }

  createServicioProducto(producto: any): Observable<any> {
    return this.http.post<Servicios>(
      `${URL_Servicio}`,
      { ...producto },
      {
        responseType: 'json',
      }
    );
  }
}
