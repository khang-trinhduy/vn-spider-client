import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { environment } from 'src/environments/environment'
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  headerOptions = {
    'Content-Type': 'application/json',
  }

  getAll = (prop, direction, index): Observable<any> => {
    return this.http
      .get(`${environment.api}/product?sort=${direction}&on=${prop}&pageIndex=${index}`)
      .pipe(catchError(this.handleError<any>('GET product')))
  }

  post = (form): Observable<any> => {
    return this.http
      .post(`${environment.api}/product`, form, { headers: this.headerOptions })
      .pipe(catchError(this.handleError<any>('CREATE product')))
  }

  delete = (id): Observable<any> => {
    return this.http
      .delete(`${environment.api}/product/${id}`, { headers: this.headerOptions })
      .pipe(catchError(this.handleError<any>('DELETE product')))
  }

  put = (id, form): Observable<any> => {
    return this.http
      .put(`${environment.api}/product/${id}`, form, { headers: this.headerOptions })
      .pipe(catchError(this.handleError<any>('PUT product')))
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error) // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }
}
