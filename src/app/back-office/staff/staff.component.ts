import { Component, OnInit } from "@angular/core";
declare const $: any;
@Component({
  selector: "app-staff",
  templateUrl: "./staff.component.html",
  styleUrls: ["./staff.component.css"],
})
export class StaffComponent implements OnInit {
  staffList: any;
  partyplotList: any;
  constructor() {}

  ngOnInit(): void {}
  addMenu() {
    $("#add-menu-modal").modal("show");
  }
}
