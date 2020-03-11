import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  httpHeaders = new HttpHeaders();
  constructor(private http: HttpClient,
              private router: Router) {
    this.httpHeaders.append('Content-Type', 'application/json');
    this.httpHeaders.append('Accept', 'application/json');
    this.httpHeaders.append('Access-Control-Allow-Origin', 'hhttp://localhost:8000/');
    this.httpHeaders.append('Access-Control-Allow-Credentials', 'true');
    this.httpHeaders.append("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    // this.httpHeaders.append("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
  }
  to(promise){
    return promise.toPromise().then(data => {
       return {
         result: data
       }
    })
    .catch(err => {
      return {
        error: err
      }
    })
 }
  async get(url,params?): Promise<Observable<any>> {
    return await this.to(this.http.get(url,{headers: this.httpHeaders,params: params}))
  }
  async post(url,data,params?): Promise<Observable<any>> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data')
    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Origin', 'http://localhost:8000/');
    return await this.to(this.http.post(url,data,{headers: headers}))
  }
  async delete(url,id): Promise<Observable<any>>{
    return await this.to(this.http.delete(url+id+'/',{headers: this.httpHeaders}))
  }
  async patch(url,id,data): Promise<Observable<any>>{
    return await this.to(this.http.patch(url+id+'/',data,{headers: this.httpHeaders}))
  }
}
