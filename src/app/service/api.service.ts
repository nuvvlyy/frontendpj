import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';

import { HttpClientService } from './http-client.service'

@Injectable({ providedIn: 'root' })

export class ApiService {
  base ="http://localhost:8000";
  // base ="https://luckystoneadmin-api.herokuapp.com/";
  baseurl = this.base +"/api";
  admin_baseurl = this.base + "/api-admin"
  auth = this.base +"/api-auth";
  api_URL = {
    stone: this.baseurl + '/stone',
    attribute: this.baseurl + '/attribute',
    user: this.admin_baseurl + '/user',
    fb_user: this.admin_baseurl + '/fb-user',
    fb_fav: this.baseurl + '/fb-favorite',
    star: this.baseurl + '/star',
    // stoneDetail: this.baseurl+ '/detail/',
  }
  constructor(private http: HttpClientService) { }

  getStone(params?): Observable<any> {

    return from(
      this.http.get(this.api_URL.stone, params).then(response => {
      return response;
    }))
  }

  getStoneDetail(id: string) {

    return from(this.http.get(this.api_URL.stone + '/' + id).then(response => {
      return response;
    }));
  }
  getAttribute() {
    return from(this.http.get(this.api_URL.attribute).then(response => {
      return response;
    }));
  }
  getUser(params?) {
    return from(this.http.get(this.api_URL.user, params).then(response => {
      return response;
    }));
  }
  postfbUser(data){
    return from(this.http.post(this.api_URL.fb_user+'/', data).then(response => {
      return response;
    }));
  }
  getFbUser(params?) {
    return from(this.http.get(this.api_URL.fb_user, params).then(response => {
      return response;
    }));
  }
  getFbFav(params?) {
    return from(this.http.get(this.api_URL.fb_fav, params).then(response => {
      return response;
    }));
  }
  postfbFav(data){
    return from(this.http.post(this.api_URL.fb_fav+'/', data).then(response => {
      return response;
    }));
  }
  delfbFav(id){
    return from(this.http.delete(this.api_URL.fb_fav+'/', id).then(response => {
      return response;
    }));
  }
  getStar(params?){
    return from(this.http.get(this.api_URL.star+'/', params).then(response => {
      return response;
    }));
  }
  postStone(data){
    return from(this.http.post(this.api_URL.stone+'/', data).then(response => {
      return response;
    }));
  }
  delStone(id){
    return from(this.http.delete(this.api_URL.stone+'/', id).then(response => {
      return response;
    }));
  }
  editStone(id,data){
    return from(this.http.patch(this.api_URL.stone+'/', id,data).then(response => {
      return response;
    }));
  }
  login(data){
    return from(this.http.post(this.auth+ '/', data).then(response => {
      return response;
    }));
  }
}

