import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Local } from '../models/Local.model';
import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';

const URL_Local = `${environment.apiUrl}local`;
export type LocalResponse = Local[] | Listado<Local>;

@Injectable({
  providedIn: 'root',
})
export class LocalesService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getLocales(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_Local;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getLocalById(id: number): Observable<any> {
    return this.http.get<any>(`${URL_Local}/${id}`, {
      responseType: 'json',
    });
  }

  updateLocal(Id: number, Local: Local): Observable<any> {
    return this.http.put<Local>(
      `${URL_Local}/${Id}`,
      { ...Local },
      {
        responseType: 'json',
      }
    );
  }

  createLocal(Local: Local): Observable<any> {
    return this.http.post<Local>(
      `${URL_Local}`,
      { ...Local },
      {
        responseType: 'json',
      }
    );
  }

  deleteLocal(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_Local}/${id}`, {
      responseType: 'json',
    });
  }
}
