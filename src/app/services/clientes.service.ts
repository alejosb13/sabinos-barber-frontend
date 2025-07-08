import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Cliente } from '../models/Cliente.model';
import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';

const URL_Cliente = `${environment.apiUrl}cliente`;
export type ClienteResponse = Cliente[] | Listado<Cliente>;

@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getClientes(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_Cliente;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getClienteById(id: number): Observable<any> {
    return this.http.get<any>(`${URL_Cliente}/${id}`, {
      responseType: 'json',
    });
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_Cliente}/${id}`, {
      responseType: 'json',
    });
  }

  updateCliente(Id: number, Cliente: Cliente): Observable<any> {
    return this.http.put<Cliente>(
      `${URL_Cliente}/${Id}`,
      { ...Cliente },
      {
        responseType: 'json',
      }
    );
  }

  createCliente(Cliente: Cliente): Observable<any> {
    return this.http.post<Cliente>(
      `${URL_Cliente}`,
      { ...Cliente },
      {
        responseType: 'json',
      }
    );
  }
}
