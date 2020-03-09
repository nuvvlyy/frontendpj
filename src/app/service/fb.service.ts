import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpClientService } from './http-client.service'
declare var FB: any;

export class FbService {


    constructor(private http: HttpClient,
    ) {
        (window as any).fbAsyncInit = function () {
            FB.init({
                appId: '523738721880315',
                cookie: true,
                xfbml: true,
                version: 'v5.0'
            });

            FB.AppEvents.logPageView();

        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

    }
    login() {
        console.log("login to facebook");
        // FB.login();
        FB.login((response) => {
            console.log('submitLogin', response);
            if (response.authResponse) {


            }
            else {
                console.log('User login failed');
            }
        }, { scope: 'email,user_birthday' });
    }

}
