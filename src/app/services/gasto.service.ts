import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
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
    logger.log({
      parametersURL,
      tets: this._Helpers.formatParameters(parametersURL),
    });
    let URL = parametersURL.link ? parametersURL.link : URL_Gasto;
    console.log({ URL });

    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getGastoById(
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
    return this.http.get<any>(`${URL_Gasto}/${id}`, option);
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
