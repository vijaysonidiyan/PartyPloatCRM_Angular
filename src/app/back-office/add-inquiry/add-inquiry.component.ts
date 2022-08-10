import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import * as moment from 'moment';
@Component({
  selector: 'app-add-inquiry',
  templateUrl: './add-inquiry.component.html',
  styleUrls: ['./add-inquiry.component.css']
})
export class AddInquiryComponent implements OnInit {
  eventList: any[] = [];
  partyplotList: any[] = [];
  constructor() { }

  ngOnInit(): void {
  }
  // addInquiry() {
  //   $("#add-menu-modal").modal("show");
  // }
  // cancleInquiry() {
  //   $("#add-menu-modal").modal("hide");
  // }
}
