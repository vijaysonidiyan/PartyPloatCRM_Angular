import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import * as moment from 'moment';

declare const $: any;
@Component({
  selector: "app-inquiry",
  templateUrl: "./inquiry.component.html",
  styleUrls: ["./inquiry.component.css"],
})
export class InquiryComponent implements OnInit {
  staffList: any[];
  l: number;
  p: number = 1;
  eventList: any[] = [];
  partyplotList: any[] = [];
  constructor() {}
  ngOnInit(): void {}
  addInquiry() {
    $("#add-menu-modal").modal("show");
  }
  cancleInquiry() {
    $("#add-menu-modal").modal("hide");
  }

  // daterangepickerOptions = {
  //   startDate: null,
  //   endDate: null,
  //   format: "DD.MM.YYYY HH:mm",
  //   minDate: moment()
  //     .add(-2, "months")
  //     .format("DD.MM.YYYY HH:mm"),
  //   maxDate: moment()
  //     .add(2, "months")
  //     .format("DD.MM.YYYY HH:mm"),
  //   inactiveBeforeStart: true,
  //   autoApply: false,
  //   showRanges: true,
  //   preDefinedRanges: [
  //     {
  //       name: "Day After tomorrow",
  //       value: {
  //         start: moment().add(2, "days"),
  //         end: moment().add(2, "days")
  //       }
  //     },
  //     {
  //       name: "Today",
  //       value: {
  //         start: moment(),
  //         end: moment()
  //       }
  //     },
  //     {
  //       name: "Tomorrow",
  //       value: {
  //         start: moment().add(1, "days"),
  //         end: moment().add(1, "days")
  //       }
  //     },
  //     {
  //       name: "This week",
  //       value: {
  //         start: moment(),
  //         end: moment().add(7, "days")
  //       }
  //     }
  //   ],
  //   singleCalendar: false,
  //   displayFormat: "DD.MM.YYYY HH:mm",
  //   position: "left",
  //   disabled: false,
  //   noDefaultRangeSelected: true,
  //   timePicker: {
  //     minuteInterval: 5,
  //     twentyFourHourFormat: true
  //   },
  //   disableBeforeStart: true
  // };
  // rangeSelected(data) {
  //   debugger;
  // }
}
