import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginLayoutComponent } from "./layouts/login-layout/login-layout.component";
import { NotifierModule } from "angular-notifier";
import { NgOtpInputModule } from  'ng-otp-input';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgOtpInputModule,
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
  declarations: [AppComponent, AdminLayoutComponent, LoginLayoutComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
