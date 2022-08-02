import { Routes } from "@angular/router";
import { MenuMasterComponent } from "app/back-office/setting/menu-master/menu-master.component";
import { RoleMasterComponent } from "app/back-office/setting/role-master/role-master.component";
import { RoleWiseMenuComponent } from "app/back-office/setting/role-wise-menu/role-wise-menu.component";
import { UserWiseMenuComponent } from "app/back-office/setting/user-wise-menu/user-wise-menu.component";

import { DashboardComponent } from "../../back-office/dashboard/dashboard.component";
import { TableListComponent } from "../../back-office/table-list/table-list.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "table-list", component: TableListComponent },
  { path: "menu-master", component: MenuMasterComponent },
  { path: "role-master", component: RoleMasterComponent },
  { path: "role-wise-menu", component: RoleWiseMenuComponent },
  { path: "user-wise-menu", component: UserWiseMenuComponent },
];
