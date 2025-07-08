import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/Usuario.model';
import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';

const URL_Usuario = `${environment.apiUrl}usuario`;
export type UsuarioResponse = Usuario[] | Listado<Usuario>;

@Injectable({
  providedIn: 'root',
})
export class UsuarioesService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getUsuarioes(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_Usuario;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get<any>(`${URL_Usuario}/${id}`, {
      responseType: 'json',
    });
  }

  updateUsuario(Id: number, Usuario: Usuario): Observable<any> {
    return this.http.put<Usuario>(
      `${URL_Usuario}/${Id}`,
      { ...Usuario },
      {
        responseType: 'json',
      }
    );
  }

  updateContraseña(
    Id: number,
    data: { password: string; password_confirmation: string }
  ): Observable<any> {
    return this.http.put<Usuario>(
      `${URL_Usuario}/update-password/${Id}`,
      { ...data },
      {
        responseType: 'json',
      }
    );
  }

  createUsuario(Usuario: Usuario): Observable<any> {
    return this.http.post<Usuario>(
      `${URL_Usuario}`,
      { ...Usuario },
      {
        responseType: 'json',
      }
    );
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_Usuario}/${id}`, {
      responseType: 'json',
    });
  }
}
