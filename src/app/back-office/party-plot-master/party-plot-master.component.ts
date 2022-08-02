import { Component, OnInit } from "@angular/core";
declare const $: any;
@Component({
  selector: "app-party-plot-master",
  templateUrl: "./party-plot-master.component.html",
  styleUrls: ["./party-plot-master.component.css"],
})
export class PartyPlotMasterComponent implements OnInit {
  facilityList: any;
  constructor() {}

  ngOnInit(): void {}
  addMenu() {
    $("#add-menu-modal").modal("show");
  }
}
