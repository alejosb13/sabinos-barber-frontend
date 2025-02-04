import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';
import { Gasto } from '../models/Gasto.model';

const URL_Gasto = `${environment.apiUrl}gasto`;
export type GastoResponse = Gasto[] | Listado<Gasto>;

@Injectable({
  providedIn: 'root',
})
export class GastoService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getGastos(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_Gasto;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getGastoById(id: number): Observable<any> {
    return this.http.get<any>(`${URL_Gasto}/${id}`, {
      responseType: 'json',
    });
  }

  updateGasto(Id: number, Gasto: Gasto): Observable<any> {
    return this.http.put<Gasto>(
      `${URL_Gasto}/${Id}`,
      { ...Gasto },
      {
        responseType: 'json',
      }
    );
  }

  createGasto(Rol: Gasto): Observable<any> {
    return this.http.post<Gasto>(
      `${URL_Gasto}`,
      { ...Rol },
      {
        responseType: 'json',
      }
    );
  }

  deleteGasto(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_Gasto}/${id}`, {
      responseType: 'json',
    });
  }
}
