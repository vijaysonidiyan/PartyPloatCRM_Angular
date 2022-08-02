import { Component, OnInit } from "@angular/core";
declare const $: any;
@Component({
  selector: "app-role-wise-menu",
  templateUrl: "./role-wise-menu.component.html",
  styleUrls: ["./role-wise-menu.component.css"],
})
export class RoleWiseMenuComponent implements OnInit {
  activeroleList: any;
  selectedRole;
  constructor() {}

  ngOnInit(): void {}
}
