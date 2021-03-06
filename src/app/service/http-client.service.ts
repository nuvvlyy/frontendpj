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
    this.httpHeaders.append('Content-Type', 'text/html');
    this.httpHeaders.append('Accept', 'application/json');
    this.httpHeaders.append('Accept', 'text/plain');
    // this.httpHeaders.append('Access-Control-Allow-Origin', 'https://luckystoneadmin-api.herokuapp.com');
    this.httpHeaders.append('Access-Control-Allow-Credentials', 'true');
    this.httpHeaders.append('Access-Control-Allow-Origin', '*');
    this.httpHeaders.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    this.httpHeaders.append('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    this.httpHeaders.append('X-CSRFTOKEN', 'gZucgSZPYReQomGO24vZKCVYxrI6l2XwHRJmgC9b1yFlzVAEpcVoKrhtJ7RWB72D');
    // this.httpHeaders.append("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
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
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Content-Type', 'text/html');
    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Access-Control-Allow-Origin', 'https://luckystoneadmin-api.herokuapp.com');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    headers.append('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    headers.append('Access-Control-Allow-Origin', 'https://luckystoneadmin-api.herokuapp.com');
    return await this.to(this.http.post(url,data,{headers: headers}))
  }
  async postjson(url,data,params?): Promise<Observable<any>> {
    const headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
    console.log(headers)
    return await this.to(this.http.post(url,data,{headers: headers}))
  }
  async delete(url,id): Promise<Observable<any>>{
    return await this.to(this.http.delete(url+id+'/',{headers: this.httpHeaders}))
  }
  async patch(url,id,data): Promise<Observable<any>>{
    const headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
    return await this.to(this.http.patch(url+id+'/',data,{headers: headers}))
  }
}
