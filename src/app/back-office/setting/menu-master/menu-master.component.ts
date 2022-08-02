import { Component, OnInit } from "@angular/core";
declare const $: any;

@Component({
  selector: "app-menu-master",
  templateUrl: "./menu-master.component.html",
  styleUrls: ["./menu-master.component.css"],
})
export class MenuMasterComponent implements OnInit {
  perentList: any;
  constructor() {}

  ngOnInit(): void {}
  addMenu() {
    $("#add-menu-modal").modal("show");
  }
  moduleList = [
    {
      name: "Dashboard",
      value: "dashboard",
    },
    {
      name: "Employee List",
      value: "employeelist",
    },
    {
      name: "Designation Master",
      value: "designationmaster",
    },
  ];
  // getPerentList() {

  //   this.adminLayoutService.getPerentList().subscribe((Response: any) => {

  //       if (Response.meta.code == 200) {
  //           this.perentList = Response.data;
  //       } else {
  //       }
  //       //for select sub industry step
  //   }, (error) => {
  //       console.log(error.error.Message);
  //   });
}
