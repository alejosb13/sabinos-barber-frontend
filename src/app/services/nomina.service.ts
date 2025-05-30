import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';
import { Nomina } from '../models/Nomina.model';

const URL_NOMINA = `${environment.apiUrl}nomina`;
export type NominaResponse = Nomina[] | Listado<Nomina>;

@Injectable({
  providedIn: 'root',
})
export class NominaService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  public LoadingCrud = false;

  // public methods
  getNominas(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_NOMINA;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getNominaById(id: number): Observable<any> {
    return this.http.get<any>(`${URL_NOMINA}/${id}`, {
      responseType: 'json',
    });
  }

  updateNomina(Id: number, Nomina: Nomina): Observable<any> {
    return this.http.put<Nomina>(
      `${URL_NOMINA}/${Id}`,
      { ...Nomina },
      {
        responseType: 'json',
      }
    );
  }

  createNomina(Rol: Nomina): Observable<any> {
    return this.http.post<Nomina>(
      `${URL_NOMINA}`,
      { ...Rol },
      {
        responseType: 'json',
      }
    );
  }

  deleteNomina(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_NOMINA}/${id}`, {
      responseType: 'json',
    });
  }

  getNominaEmpleado(
    empliado_id: number,
    parametersURL: ParametersUrl
  ): Observable<any> {
    let URL = parametersURL.link
      ? parametersURL.link
      : `${URL_NOMINA}/empleado/${empliado_id}`;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }
}
