import { Component, OnInit } from "@angular/core";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
declare const $: any;
@Component({
  selector: "app-role-wise-menu",
  templateUrl: "./role-wise-menu.component.html",
  styleUrls: ["./role-wise-menu.component.css"],
})
export class RoleWiseMenuComponent implements OnInit {
  isRoleMenulistOpen: boolean = false;
  activeroleList: any;
  selectedRole;
  constructor(public adminLayoutService: AdminLayoutService) {}

  ngOnInit(): void {
    this.getRoleActiveList();
    this.selectedRole = null;
  }
  rolemenuList() {
    this.isRoleMenulistOpen = !this.isRoleMenulistOpen;
  }
  getRoleActiveList() {
    this.adminLayoutService.getRoleList().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.activeroleList = Response.data;
        } else {
        }
        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }
}
