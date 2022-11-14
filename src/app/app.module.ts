import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginLayoutComponent } from "./layouts/login-layout/login-layout.component";
import { NotifierModule } from "angular-notifier";
import { NgOtpInputModule } from 'ng-otp-input';
import { BreadcrumbModule } from "angular-crumbs";
import { NgxSpinnerModule } from 'ngx-spinner';
import { InterceptorService } from './Providers/core-interceptor/core-interceptor.service';
import { CoreModule } from './Providers/core.module';
import { HomeComponent } from './front-office/home/home.component';
import { FrontLayoutComponent } from "./layouts/front-layout/front-layout.component";

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgxSpinnerModule,
    NgOtpInputModule,
    BreadcrumbModule,
    NotifierModule.withConfig({
      // Custom options in here
      position: {
        horizontal: {
          position: "middle",
          //distance: 50,
        },
        vertical: {
          position: "bottom",
          distance: 50,
          gap: 10,
        },
      },
      //behaviour: {
      //  autoHide: false
      //}
    }),
  ],
  declarations: [AppComponent, AdminLayoutComponent, LoginLayoutComponent,FrontLayoutComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
