import { Routes } from "@angular/router";
import { AddInquiryComponent } from "app/back-office/add-inquiry/add-inquiry.component";
import { BookingConfirmListComponent } from "app/back-office/Booking-Confirm-Inquiry/booking-confirm-list/booking-confirm-list.component";
import { BookingConfirmComponent } from "app/back-office/booking-confirm-inquiry/booking-confirm/booking-confirm.component";
import { ViewBookingComponent } from "app/back-office/Booking-Confirm-Inquiry/view-booking/view-booking.component";
import { EventMasterComponent } from "app/back-office/event-master/event-master.component";
import { InquiryComponent } from "app/back-office/inquiry/inquiry.component";
import { AddPackageMasterComponent } from "app/back-office/package-master/add-package-master/add-package-master.component";
import { PackageMasterComponent } from "app/back-office/package-master/package-master.component";
import { PartyPlotMasterComponent } from "app/back-office/party-plot-master/party-plot-master.component";
import { ProductMasterComponent } from "app/back-office/product-master/product-master.component";
import { CompanySettingComponent } from "app/back-office/setting/company-setting/company-setting.component";
import { MenuMasterComponent } from "app/back-office/setting/menu-master/menu-master.component";
import { ModuleMasterComponent } from "app/back-office/setting/module-master/module-master.component";
import { ReferenceMasterComponent } from "app/back-office/setting/reference-master/reference-master.component";
import { RoleMasterComponent } from "app/back-office/setting/role-master/role-master.component";
import { RoleWiseMenuComponent } from "app/back-office/setting/role-wise-menu/role-wise-menu.component";
import { UserWiseMenuComponent } from "app/back-office/setting/user-wise-menu/user-wise-menu.component";
import { StaffComponent } from "app/back-office/staff/staff.component";
import { VendorDetailsComponent } from "app/back-office/vendor-details/vendor-details.component";

import { DashboardComponent } from "../../back-office/dashboard/dashboard.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent, data: { breadcrumb: 'Dashboard' } },
  { path: "setting/menu-master", component: MenuMasterComponent, data: { breadcrumb: 'Menu Master' } },
  { path: "setting/module-master", component: ModuleMasterComponent, data: { breadcrumb: 'Module Master' } },
  { path: "setting/reference-master", component: ReferenceMasterComponent, data: { breadcrumb: 'Reference Master' } },
  { path: "setting/role-master", component: RoleMasterComponent, data: { breadcrumb: 'Role Master' } },
  { path: "setting/role-wise-menu", component: RoleWiseMenuComponent, data: { breadcrumb: 'Role Wise Menu' } },
  { path: "setting/user-wise-menu", component: UserWiseMenuComponent, data: { breadcrumb: 'User Wise Menu' } },
  { path: "setting/company-setting", component: CompanySettingComponent, data: { breadcrumb: 'Company Setting' } },
  { path: "party-plot-master", component: PartyPlotMasterComponent, data: { breadcrumb: 'Party Plot Master' } },
  { path: "package-master", component: PackageMasterComponent, data: { breadcrumb: 'Package Master' } },
  { path: "package-master/add-package-master", component: AddPackageMasterComponent, data: { breadcrumb: 'Add Package Master' } },
  { path: "package-master/edit-package-master/:id", component: AddPackageMasterComponent, data: { breadcrumb: 'Edit Package Master' } },
  { path: "staff", component: StaffComponent, data: { breadcrumb: 'Staff' } },
  { path: "event-master", component: EventMasterComponent, data: { breadcrumb: 'Event Master' } },
  { path: "product-master", component: ProductMasterComponent, data: { breadcrumb: 'Product Master' } },
  { path: "vendor-details", component: VendorDetailsComponent, data: { breadcrumb: 'Vendor Details' } },
  { path: "booking-confirm/:id", component: BookingConfirmComponent, data: { breadcrumb: 'Booking Confirm' } },
  { path: "booking-confirm-list", component: BookingConfirmListComponent, data: { breadcrumb: 'Booking Confirm List' } },
  { path: "view-booking-confirm/:id", component: ViewBookingComponent, data: { breadcrumb: 'View Booking Confirm' } },
  {
    path: "inquiry/list-view", component: InquiryComponent, data: { breadcrumb: 'Inquiry' },
    // children: [
    //   { path: 'add-inquiry', component: AddInquiryComponent, data: { breadcrumb: "Add Inquiry" } }
    // ]
  },
  {
    path: "inquiry/calender-view", component: InquiryComponent, data: { breadcrumb: 'Inquiry' },
  },
  { path: "inquiry/add-inquiry", component: AddInquiryComponent, data: { breadcrumb: 'Add Inquiry' } },
  { path: "inquiry/view-inquiry/:id", component: AddInquiryComponent, data: { breadcrumb: 'View Inquiry' } },
];
