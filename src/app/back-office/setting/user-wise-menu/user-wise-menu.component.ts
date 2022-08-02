import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-user-wise-menu",
  templateUrl: "./user-wise-menu.component.html",
  styleUrls: ["./user-wise-menu.component.css"],
})
export class UserWiseMenuComponent implements OnInit {
  activeroleList: any;
  selectedRole = null;
  constructor() {}

  ngOnInit(): void {}
}
