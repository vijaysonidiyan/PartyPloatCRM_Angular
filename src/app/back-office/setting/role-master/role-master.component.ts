import { Component, OnInit } from "@angular/core";
declare const $: any;
@Component({
  selector: "app-role-master",
  templateUrl: "./role-master.component.html",
  styleUrls: ["./role-master.component.css"],
})
export class RoleMasterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  addRole() {
    $("#add-role-modal").modal("show");
  }
}
