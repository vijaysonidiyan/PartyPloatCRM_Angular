import { Component, OnInit } from "@angular/core";
declare const $: any;
@Component({
  selector: "app-vendor-details",
  templateUrl: "./vendor-details.component.html",
  styleUrls: ["./vendor-details.component.css"],
})
export class VendorDetailsComponent implements OnInit {
  productList: any;
  constructor() {}

  ngOnInit(): void {}
  addMenu() {
    $("#add-menu-modal").modal("show");
  }
}
