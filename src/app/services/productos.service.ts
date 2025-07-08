import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Producto } from '../models/Producto.model';
import { Listado } from '../models/Listados.model';
import { HelpersService } from './helpers.service';
import { ParametersUrl } from '../models/Parameter.model';
import logger from '../shared/utils/logger';

const URL_PRODUCTO = `${environment.apiUrl}producto`;
export type ProductoResponse = Producto[] | Listado<Producto>;

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  // constructor(private http: HttpClient) {}
  private http = inject(HttpClient);
  private _Helpers = inject(HelpersService);

  // public methods
  getProductos(parametersURL: ParametersUrl): Observable<any> {
    let URL = parametersURL.link ? parametersURL.link : URL_PRODUCTO;
    // logger.log(URL, parametersURL);
    return this.http.get<any>(URL, {
      params: this._Helpers.formatParameters(parametersURL),
      responseType: 'json',
    });
  }

  getProductoById(id: number): Observable<any> {
    return this.http.get<any>(`${URL_PRODUCTO}/${id}`, {
      responseType: 'json',
    });
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${URL_PRODUCTO}/${id}`, {
      responseType: 'json',
    });
  }

  updateProducto(Id: number, producto: Producto): Observable<any> {
    return this.http.put<Producto>(
      `${URL_PRODUCTO}/${Id}`,
      { ...producto },
      {
        responseType: 'json',
      }
    );
  }

  createProducto(producto: Producto): Observable<any> {
    return this.http.post<Producto>(
      `${URL_PRODUCTO}`,
      { ...producto },
      {
        responseType: 'json',
      }
    );
  }
}
