import { Component, OnInit } from "@angular/core";
declare const $: any;
@Component({
  selector: "app-product-master",
  templateUrl: "./product-master.component.html",
  styleUrls: ["./product-master.component.css"],
})
export class ProductMasterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  addMenu() {
    $("#add-menu-modal").modal("show");
  }
}
