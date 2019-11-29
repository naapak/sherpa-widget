import { Injectable} from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Observable }  from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';

const mainUrl: String = 'https://sandbox.api.joinsherpa.com/v2/'

@Injectable()
export class SherpaService {

  private handleError: HandleError;

  constructor(private http: HttpClient,httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('SherapService');
    
   }

  getEntryRequirements (requirements:Object ): Observable<any> {
   let endpoint: string = mainUrl + 'entry-requirements'
    if (requirements !== null) {
      const urlParams =  '?' + new URLSearchParams(Object.entries(requirements));
      endpoint += urlParams +'&key=AIzaSyBtuv-WwvafRQWR8-9duC5ndH2aDvGgKPw'
    }

    return this.http.get<any>(endpoint)
      .pipe(
        catchError(this.handleError('sherpaEroor', requirements))
      );
  }

  getCountries (language) : Observable<any> {
    let endpoint = `https://sdk-staging.joinsherpa.io/cdn/localization/${language}.json`
    return this.http.get<any>(endpoint)
      .pipe(
        catchError(this.handleError('sherpaEroor'))
      );
  }

}