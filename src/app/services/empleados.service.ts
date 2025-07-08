import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Empleado } from '../models/Empleado.model';
import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';

const URL_Empleado = `${environment.apiUrl}empleado`;
export type EmpleadoResponse = Empleado[] | Listado<Empleado>;

@Injectable({
  providedIn: 'root',
})
export class EmpleadosService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getEmpleadoes(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_Empleado;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getEmpleadoById(id: number): Observable<any> {
    return this.http.get<any>(`${URL_Empleado}/${id}`, {
      responseType: 'json',
    });
  }

  updateEmpleado(Id: number, Empleado: Empleado): Observable<any> {
    return this.http.put<Empleado>(
      `${URL_Empleado}/${Id}`,
      { ...Empleado },
      {
        responseType: 'json',
      }
    );
  }

  createEmpleado(Empleado: Empleado): Observable<any> {
    return this.http.post<Empleado>(
      `${URL_Empleado}`,
      { ...Empleado },
      {
        responseType: 'json',
      }
    );
  }

  deleteEmpleado(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_Empleado}/${id}`, {
      responseType: 'json',
    });
  }
}
