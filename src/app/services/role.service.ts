import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Role } from '../models/Role.model';
import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';

const URL_ROLE = `${environment.apiUrl}roles`;
export type RolResponse = Role[] | Listado<Role>;

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getRoles(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_ROLE;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getRolById(id: number): Observable<any> {
    return this.http.get<any>(`${URL_ROLE}/${id}`, {
      responseType: 'json',
    });
  }

  updateRol(Id: number, Rol: Role): Observable<any> {
    return this.http.put<Role>(
      `${URL_ROLE}/${Id}`,
      { ...Rol },
      {
        responseType: 'json',
      }
    );
  }

  createRol(Rol: Role): Observable<any> {
    return this.http.post<Role>(
      `${URL_ROLE}`,
      { ...Rol },
      {
        responseType: 'json',
      }
    );
  }

  deleteRol(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_ROLE}/${id}`, {
      responseType: 'json',
    });
  }
}
