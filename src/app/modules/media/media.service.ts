import { HttpClient, HttpEvent, HttpRequest, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Media } from './media';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private httpClient: HttpClient) {}

  public fetchById(orgId: string, id: string): Observable<any> {
    return this.httpClient.get(`${environment.BASE_API_ENDPOINT}/media/${id}/media/${id}`);
  }

  public fetchByOrgId(orgId: string): Observable<any> {
    return this.httpClient.get(`${environment.BASE_API_ENDPOINT}/media/${orgId}/media`);
  }

  public fetchByTags(orgId: string, tags: string[]): Observable<any> {
    const params = new HttpParams();
    let arrayString = '/?';
    console.log('fetch  ', tags);
    tags.forEach(tag => {
      arrayString += `tag=${tag}`;
      // params.append('tag', tag);
    });
    return this.httpClient.get(`${environment.BASE_API_ENDPOINT}/media/${orgId}/media/search/union/tags${arrayString}`);
  }
}
