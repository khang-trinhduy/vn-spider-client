import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { environment } from 'src/environments/environment'
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor(private http: HttpClient) {}

  headerOptions = {
    'Content-Type': 'application/json',
  }

  getAll = (prop, direction, index): Observable<any> => {
    return this.http
      .get(`${environment.api}/bank?sort=${direction}&on=${prop}&pageIndex=${index}`)
      .pipe(catchError(this.handleError<any>('GET BANK')))
  }

  post = (form): Observable<any> => {
    return this.http
      .post(`${environment.api}/bank`, form, { headers: this.headerOptions })
      .pipe(catchError(this.handleError<any>('CREATE BANK')))
  }

  delete = (id): Observable<any> => {
    return this.http
      .delete(`${environment.api}/bank/${id}`, { headers: this.headerOptions })
      .pipe(catchError(this.handleError<any>('DELETE BANK')))
  }

  put = (id, form): Observable<any> => {
    return this.http
      .put(`${environment.api}/bank/${id}`, form, { headers: this.headerOptions })
      .pipe(catchError(this.handleError<any>('PUT BANK')))
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
