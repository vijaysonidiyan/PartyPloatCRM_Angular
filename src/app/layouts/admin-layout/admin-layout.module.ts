import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../back-office/dashboard/dashboard.component";
import { TableListComponent } from "../../back-office/table-list/table-list.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
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
import { FacilityMasterComponent } from "app/back-office/facility-master/facility-master.component";
import { ProductMasterComponent } from "app/back-office/product-master/product-master.component";
import { VendorDetailsComponent } from "app/back-office/vendor-details/vendor-details.component";

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
    FacilityMasterComponent,
    ProductMasterComponent,
    VendorDetailsComponent
  ],
})
export class AdminLayoutModule {}
