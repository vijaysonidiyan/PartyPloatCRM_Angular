import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, ThemePalette, MAT_DATE_LOCALE } from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-add-inquiry',
  templateUrl: './add-inquiry.component.html',
  styleUrls: ['./add-inquiry.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddInquiryComponent implements OnInit {
  partyplotList: any;
  clientinquiryDataForm: FormGroup | any;
  eventList: any;
  eventActiveList: any;
  ISeditClientInquiry = false;

  // calender
  public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate = new Date();
  public minEndDate = {};
  public maxDate = new Date();

  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  // startDateObj = '';
  // endDateObj = '';
  selectedDate: any
  minEndTime = {};
  //calender done

  get fclientinquiryData() {
    return this.clientinquiryDataForm.controls;
  }
  submittedclientInquiryData = false;

  constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService, private router: Router, public route: ActivatedRoute) {

    this.route.queryParams.subscribe((queryParams) => {
      debugger
      if (!!queryParams.startDate) {
        // if (!!queryParams.startDate && !!queryParams.endDate) {
        this.selectedDate = queryParams.startDate;
        this.minDate = new Date(queryParams.startDate);
        let maxDate = new Date(this.selectedDate).getFullYear() + '-' + (new Date(this.selectedDate).getMonth() + 1) + '-' + new Date(this.selectedDate).getDate();
        this.maxDate = new Date(maxDate + ' ' + '23:59');
        // this.startDateObj = queryParams.startDate;
        // this.endDateObj = queryParams.endDate;
      }
      else {
        this.selectedDate = '';
        // this.startDateObj = '';
        // this.endDateObj = '';
      }
    });
  }

  ngOnInit(): void {
    this.getEventActiveList();
    this.defaultForm();
    this.eventList = this.clientinquiryDataForm.get("events") as FormArray;
    this.minEndDate[0] = new Date();
    this.eventList.push(this.createeventItem({}));
  }

  onStartDateChange(data: any, index: any) {
    this.minEndDate[index] = data._d;
    (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['endDateObj'].setValue(data._d));
  }

  onStartTimeChange(time: any, index: any) {
    debugger
    let maxDate = new Date(this.selectedDate).getFullYear() + '-' + (new Date(this.selectedDate).getMonth() + 1) + '-' + new Date(this.selectedDate).getDate();
    this.minEndTime[index] = new Date(maxDate + ' ' + time.target.value);
    // this.minEndTime[index] = time.target.value
  }

  getEventActiveList() {
    this.adminLayoutService.geteventActiveList().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.eventActiveList = Response.data;
        } else {
        }
        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  defaultForm() {
    this.clientinquiryDataForm = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      primaryContact: ["", [Validators.required]],
      secondryContact: [""],
      address: ["", [Validators.required]],
      events: this.fb.array([]),
    });
  }

  createeventItem(oItem?: any): FormGroup {
    return this.fb.group({
      eventType: [(oItem['eventType'] ? oItem['eventType'] : null)],
      guest: [(oItem['guest'] ? oItem['guest'] : '')],
      startDateObj: [(oItem['startDateObj'] ? oItem['startDateObj'] : !!this.selectedDate ? new Date(this.selectedDate) : '')],
      endDateObj: [(oItem['endDateObj'] ? oItem['endDateObj'] : !!this.selectedDate ? new Date(this.selectedDate) : '')],
      // startTimeObj: [(oItem['endTimeObj'] ? oItem['endTimeObj'] : '')],
      // endTimeObj: [(oItem['endTimeObj'] ? oItem['endTimeObj'] : '')],
    });
  }

  addEventList() {
    this.eventList.push(this.createeventItem({}));
  }

  deletEventList(index: number) {
    const remove = this.eventList;
    remove.removeAt(index)
  }

  saveClientInquiry() {
    debugger
    if (this.clientinquiryDataForm.invalid) {
      this.submittedclientInquiryData = true;
      return;
    }
    // let eventObjList = [];
    // this.clientinquiryDataForm.controls.events.value.map((x: any) => {
    //   // if (!!x.endDateObj._d && !!x.startDateObj._d) {
    //   //   let eventObj = {
    //   //     eventType: x.eventType,
    //   //     guest: x.guest,
    //   //     startDateObj: x.startDateObj._d,
    //   //     endDateObj: x.endDateObj._d
    //   //   }
    //   //   eventObjList.push(eventObj);
    //   // }
    //   // else if (!!x.startDateObj._d && x.endDateObj) {
    //   //   let eventObj = {
    //   //     eventType: x.eventType,
    //   //     guest: x.guest,
    //   //     startDateObj: x.startDateObj._d,
    //   //     endDateObj: x.endDateObj
    //   //   }
    //   //   eventObjList.push(eventObj);
    //   // }
    //   // else if (!!x.endDateObj._d && x.startDateObj) {
    //   //   let eventObj = {
    //   //     eventType: x.eventType,
    //   //     guest: x.guest,
    //   //     startDateObj: x.startDateObj,
    //   //     endDateObj: x.endDateObj._d
    //   //   }
    //   //   eventObjList.push(eventObj);
    //   // }
    //   // else if (x.endDateObj && x.startDateObj) {
    //   //   let eventObj = {
    //   //     eventType: x.eventType,
    //   //     guest: x.guest,
    //   //     startDateObj: x.startDateObj,
    //   //     endDateObj: x.endDateObj
    //   //   }
    //   //   eventObjList.push(eventObj);
    //   // }
    //   let selectedDate = new Date(this.selectedDate).getFullYear() + '-' + (new Date(this.selectedDate).getMonth() + 1) + '-' + new Date(this.selectedDate).getDate();

    //   let startDateObj = new Date(selectedDate + ' ' + x.startTimeObj);
    //   let endDateObj = new Date(selectedDate + ' ' + x.endTimeObj);

    //   let eventObj = {
    //     eventType: x.eventType,
    //     guest: x.guest,
    //     startDateObj: startDateObj,
    //     endDateObj: endDateObj
    //   }
    //   eventObjList.push(eventObj);
    // })

    let clientinquiryModelObj = {
      name: this.clientinquiryDataForm.controls.name.value,
      email: this.clientinquiryDataForm.controls.email.value,
      primaryContact: this.clientinquiryDataForm.controls.primaryContact.value,
      secondryContact: this.clientinquiryDataForm.controls.secondryContact.value,
      address: this.clientinquiryDataForm.controls.address.value,
      events: this.clientinquiryDataForm.controls.events.value
    };
    // return
    this.adminLayoutService.createClientinquiry(clientinquiryModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedclientInquiryData = false;
          this.getEventActiveList();
          this.defaultForm();
          this.ISeditClientInquiry = false;
          this.commonService.notifier.notify("success", Response.meta.message);
          this.router.navigate(["/admin/inquiry"])
        } else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
