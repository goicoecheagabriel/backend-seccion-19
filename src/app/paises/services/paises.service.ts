import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';

import { environment as env } from '../../../environments/environment';
import { Pais, PaisSmall } from '../interfaces/paises.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];


  get regiones(): string[]{
    return [ ...this._regiones ];
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]>{
    const options = {
      params: {
        filters: 'alpha3Code;name'
    }
    }
    return this.http.get<PaisSmall[]>(`${env.baseUrl}/continent/${ region }`, options);
  }



getPaisPorCodigo( codigo: string ): Observable<Pais | null> {
  if ( !codigo ){
    return of(null);
  }

  return this.http.get<Pais>(`${ env.baseUrl }/alpha/${ codigo }`)
}

getPaisPorCodigoSmall( codigo:string ): Observable<PaisSmall> {

  const header = {
    params: {
      fields: 'alpha3Code,name'
    }
  }

  return this.http.get<PaisSmall>(`${ env.baseUrl }/alpha/${ codigo }`, header)
}

getPaisesPorCodigos( borders: string[] ): Observable<PaisSmall[]> {
  if ( !borders ){
    return of( [] )
  }

  const peticiones : Observable<PaisSmall>[] = [];

  borders.forEach( codigo => {
    const peticion = this.getPaisPorCodigoSmall( codigo );
    peticiones.push( peticion );
  } )

  return combineLatest( peticiones );
}

}
