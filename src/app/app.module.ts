import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from 'ng2-file-upload';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgxEditorModule } from 'ngx-editor';
import {EditorModule} from 'primeng/editor';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {CodeHighlighterModule} from 'primeng/codehighlighter';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';
import { NgxQuillModule } from '@dimpu/ngx-quill'
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';
import { Step1Component } from './design_bracelet/step1/step1.component';
import { DesignComponent } from './design_bracelet/design_bracelet/design.component';
import { Step2Component } from './design_bracelet/step2/step2.component';
import { MatCardModule } from '@angular/material/card';
import { StoneDetailComponent } from './stone-detail/stone-detail.component';
import { AddComponent } from './admin/add/add.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginModalComponent } from './auth/login-modal/login-modal.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { FbCallbackComponent } from './fb-callback/fb-callback.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { ProfileEditComponent } from './auth/profile-edit/profile-edit.component';
import { FaveriteComponent } from './faverite/faverite.component';
import { LoadingComponent } from './loading/loading.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { Step3Component } from './design_bracelet/step3/step3.component';
import { SizeDetectorComponent } from './size-detector/size-detector.component';
import { EditComponent } from './admin/edit/edit.component';
import {MatTooltipModule} from '@angular/material';
import { ToastGlobalComponent } from './toast-global/toast-global.component';
import { ToastsContainer } from './toasts-container/toasts-container.component';
import { AdminNavComponent } from './admin/admin-nav/admin-nav.component';
import { FooterComponent } from './footer/footer.component';


const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'design', component: DesignComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'detail/:id', component:StoneDetailComponent},
  { path: 'login', component: LoginComponent},
  { path: 'admin/home',component: AdminHomeComponent},
  { path: 'fb/callback',component: FbCallbackComponent},
  { path: 'profile',component: ProfileComponent},
  { path: 'register',component: RegisterComponent},
  { path: 'favorite',component: FaveriteComponent},
  { path: 'settings/edit-profile',component: ProfileEditComponent},
  { path: 'admin/login',component: AdminLoginComponent},
  { path: 'admin',component: AdminHomeComponent},
  { path: 'admin/add',component: AddComponent} ,
  { path: 'admin/edit/:id',component: EditComponent},
  { path: '**',  redirectTo: '/home', pathMatch: 'full' }
  // { path: '/register',component: FbCallbackComponent},

];
// @ts-ignore
// @ts-ignore
// @ts-ignore
const fbLoginOptions: LoginOpt = {
  scope: 'id,first_name,last_name,birthday,email',
  return_scopes: true,
  enable_profile_selector: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    Step1Component,
    DesignComponent,
    Step2Component,
    StoneDetailComponent,
    AddComponent,
    LoginComponent,
    LoginModalComponent,
    AdminHomeComponent,
    FbCallbackComponent,
    ProfileComponent,
    ProfileEditComponent,
    RegisterComponent,
    FaveriteComponent,
    LoadingComponent,
    AdminLoginComponent,
    Step3Component,
    SizeDetectorComponent,
    EditComponent,
    ToastGlobalComponent,
    ToastsContainer,
    AdminNavComponent,
    FooterComponent,

  ],
  imports: [

    // QuillModule.forRoot({
    //   modules: {
    //     syntax: true,
    //     toolbar: []
    //   }
    // }),
    // domtoimage,
    BrowserModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    FileUploadModule,
    BrowserModule,
    AppRoutingModule,
    NgxQuillModule,
    // CKEditorModule,
    // NgbModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    MatCardModule,
    NgxEditorModule,
    EditorModule,
    ButtonModule,
    TabViewModule,
    CodeHighlighterModule,
    AngularEditorModule,
    AngularSvgIconModule.forRoot(),
    RouterModule.forRoot(
      appRoutes
    ),
    NgbModule,
    EditorModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
