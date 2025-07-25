import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import { Saldo } from '../models/Saldo.model';

const URL_Saldo = `${environment.apiUrl}ajuste_saldo`;

@Injectable({
  providedIn: 'root',
})
export class SaldoService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getSaldos(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_Saldo;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getSaldoById(id: number): Observable<any> {
    return this.http.get<any>(`${URL_Saldo}/${id}`, {
      responseType: 'json',
    });
  }

  updateSaldo(Id: number, saldo: Saldo): Observable<any> {
    return this.http.put<Saldo>(
      `${URL_Saldo}/${Id}`,
      { ...saldo },
      {
        responseType: 'json',
      }
    );
  }

  createSaldo(saldo: Saldo): Observable<any> {
    return this.http.post<Saldo>(
      `${URL_Saldo}`,
      { ...saldo },
      {
        responseType: 'json',
      }
    );
  }

  deleteSaldo(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_Saldo}/${id}`, {
      responseType: 'json',
    });
  }
}
