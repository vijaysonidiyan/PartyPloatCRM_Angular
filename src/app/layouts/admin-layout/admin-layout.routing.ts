import { Routes } from "@angular/router";
import { AddInquiryComponent } from "app/back-office/add-inquiry/add-inquiry.component";
import { EventMasterComponent } from "app/back-office/event-master/event-master.component";
import { InquiryComponent } from "app/back-office/inquiry/inquiry.component";
import { PartyPlotMasterComponent } from "app/back-office/party-plot-master/party-plot-master.component";
import { ProductMasterComponent } from "app/back-office/product-master/product-master.component";
import { CompanySettingComponent } from "app/back-office/setting/company-setting/company-setting.component";
import { MenuMasterComponent } from "app/back-office/setting/menu-master/menu-master.component";
import { ModuleMasterComponent } from "app/back-office/setting/module-master/module-master.component";
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
  { path: "setting/role-master", component: RoleMasterComponent, data: { breadcrumb: 'Role Master' } },
  { path: "setting/role-wise-menu", component: RoleWiseMenuComponent, data: { breadcrumb: 'Role Wise Menu' } },
  { path: "setting/user-wise-menu", component: UserWiseMenuComponent, data: { breadcrumb: 'User Wise Menu' } },
  { path: "setting/company-setting", component: CompanySettingComponent, data: { breadcrumb: 'Company Setting' } },
  { path: "party-plot-master", component: PartyPlotMasterComponent, data: { breadcrumb: 'Party Plot Master' } },
  { path: "staff", component: StaffComponent, data: { breadcrumb: 'Staff' } },
  { path: "event-master", component: EventMasterComponent, data: { breadcrumb: 'Event Master' } },
  { path: "product-master", component: ProductMasterComponent, data: { breadcrumb: 'Product Master' } },
  { path: "vendor-details", component: VendorDetailsComponent, data: { breadcrumb: 'Vendor Details' } },
  {
    path: "inquiry", component: InquiryComponent, data: { breadcrumb: 'Inquiry' },
    // children: [
    //   { path: 'add-inquiry', component: AddInquiryComponent, data: { breadcrumb: "Add Inquiry" } }
    // ]
  },
  { path: "inquiry/add-inquiry", component: AddInquiryComponent, data: { breadcrumb: 'Add Inquiry' } },
];
