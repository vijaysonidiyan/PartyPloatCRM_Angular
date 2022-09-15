import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../back-office/dashboard/dashboard.component";
import { TableListComponent } from "../../back-office/table-list/table-list.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MenuMasterComponent } from "app/back-office/setting/menu-master/menu-master.component";
import { RoleMasterComponent } from "app/back-office/setting/role-master/role-master.component";
import { RoleWiseMenuComponent } from "app/back-office/setting/role-wise-menu/role-wise-menu.component";
import { UserWiseMenuComponent } from "app/back-office/setting/user-wise-menu/user-wise-menu.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { PartyPlotMasterComponent } from "app/back-office/party-plot-master/party-plot-master.component";
import { StaffComponent } from "app/back-office/staff/staff.component";
import { EventMasterComponent } from "app/back-office/event-master/event-master.component";
import { ProductMasterComponent } from "app/back-office/product-master/product-master.component";
import { VendorDetailsComponent } from "app/back-office/vendor-details/vendor-details.component";
import { NgxPaginationModule } from "ngx-pagination";
import { DirectivesModule } from "app/shared/directives/directives.module";
import { CompanySettingComponent } from "app/back-office/setting/company-setting/company-setting.component";
import { InquiryComponent } from "app/back-office/inquiry/inquiry.component";
import { AddInquiryComponent } from "app/back-office/add-inquiry/add-inquiry.component";
import { NgxMaskModule } from 'ngx-mask'
//import { DaterangepickerModule } from "angular-2-daterangepicker";
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ModuleMasterComponent } from "app/back-office/setting/module-master/module-master.component";
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ReferenceMasterComponent } from 'app/back-office/setting/reference-master/reference-master.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);
import { BreadcrumbModule } from "angular-crumbs";
import { PackageMasterComponent } from "app/back-office/package-master/package-master.component";
import { AddPackageMasterComponent } from "app/back-office/package-master/add-package-master/add-package-master.component";
import { BookingConfirmComponent } from "app/back-office/booking-confirm/booking-confirm.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgSelectModule,
    NgxPaginationModule,
    DirectivesModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatMomentModule,
    FullCalendarModule,
    //DaterangepickerModule
    NgxMaskModule.forRoot(),
    BreadcrumbModule,
  ],
  declarations: [
    DashboardComponent,
    TableListComponent,
    MenuMasterComponent,
    RoleMasterComponent,
    RoleWiseMenuComponent,
    UserWiseMenuComponent,
    PartyPlotMasterComponent,
    StaffComponent,
    EventMasterComponent,
    ProductMasterComponent,
    VendorDetailsComponent,
    CompanySettingComponent,
    InquiryComponent,
    AddInquiryComponent,
    ModuleMasterComponent,
    ReferenceMasterComponent,
    PackageMasterComponent,
    AddPackageMasterComponent,
    BookingConfirmComponent
  ],
  providers: [MatDatepickerModule],
})
export class AdminLayoutModule { }
