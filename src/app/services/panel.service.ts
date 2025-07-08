import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';
import { Panel } from '../models/Panel.model';

const URL_PANEL = `${environment.apiUrl}panel`;

@Injectable({
  providedIn: 'root',
})
export class PanelService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getPanel(parametersURL: ParametersUrl): Observable<Panel> {
    let URL = parametersURL.link ? parametersURL.link : URL_PANEL;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }
}
