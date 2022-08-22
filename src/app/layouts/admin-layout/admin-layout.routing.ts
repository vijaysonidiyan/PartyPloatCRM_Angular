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
import { TableListComponent } from "../../back-office/table-list/table-list.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "table-list", component: TableListComponent },
  { path: "setting", component: MenuMasterComponent },
  { path: "setting/menu-master", component: MenuMasterComponent },
  { path: "setting/module-master", component: ModuleMasterComponent },
  { path: "setting/role-master", component: RoleMasterComponent },
  { path: "setting/role-wise-menu", component: RoleWiseMenuComponent },
  { path: "setting/user-wise-menu", component: UserWiseMenuComponent },
  { path: "setting/company-setting", component: CompanySettingComponent },
  { path: "party-plot-master", component: PartyPlotMasterComponent },
  { path: "staff", component: StaffComponent },
  { path: "event-master", component: EventMasterComponent },
  { path: "product-master", component: ProductMasterComponent },
  { path: "vendor-details", component: VendorDetailsComponent },
  { path: "inquiry", component: InquiryComponent },
  { path: "add-inquiry", component: AddInquiryComponent },
];
