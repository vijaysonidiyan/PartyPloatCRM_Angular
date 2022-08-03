import { Component, OnInit } from "@angular/core";
declare const $: any;
@Component({
  selector: "app-facility-master",
  templateUrl: "./facility-master.component.html",
  styleUrls: ["./facility-master.component.css"],
})
export class FacilityMasterComponent implements OnInit {
  facilityMasterList: any;
  constructor() {}

  ngOnInit(): void {}
  addMenu() {
    $("#add-menu-modal").modal("show");
  }
}
