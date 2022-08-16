import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import * as moment from 'moment';
@Component({
  selector: 'app-add-inquiry',
  templateUrl: './add-inquiry.component.html',
  styleUrls: ['./add-inquiry.component.css']
})
export class AddInquiryComponent implements OnInit {

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
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  //calender done

  get fclientinquiryData() {
    return this.clientinquiryDataForm.controls;
  }
  submittedclientInquiryData = false;

  constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.getEventActiveList();
    this.defaultForm();
    this.eventList = this.clientinquiryDataForm.get("events") as FormArray;
    this.eventList.push(this.createeventItem({}));
  }

  onStartDateChange(index: any) {
    debugger
    (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['endDateObj'].setValue(''));
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
      startDateObj: [(oItem['startDateObj'] ? oItem['startDateObj'] : '')],
      endDateObj: [(oItem['endDateObj'] ? oItem['endDateObj'] : '')],
      // startDateObj: [(oItem['startDateObj'] ? oItem['startDateObj'] : '2022-08-10T09:58:36.274Z')],
      // endDateObj: [(oItem['endDateObj'] ? oItem['endDateObj'] : '2022-08-10T11:58:36.274Z')],
    });
  }

  addEventList() {
    this.eventList.push(this.createeventItem({}))
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
    let eventObjList = [];
    this.clientinquiryDataForm.controls.events.value.map((x: any) => {
      if (!!x.endDateObj._d && !!x.startDateObj._d) {
        let eventObj = {
          eventType: x.eventType,
          guest: x.guest,
          startDateObj: x.startDateObj._d,
          endDateObj: x.endDateObj._d
        }
        eventObjList.push(eventObj);
      }
      else if (!!x.startDateObj._d && x.endDateObj) {
        let eventObj = {
          eventType: x.eventType,
          guest: x.guest,
          startDateObj: x.startDateObj._d,
          endDateObj: x.endDateObj
        }
        eventObjList.push(eventObj);
      }
      else if (!!x.endDateObj._d && x.startDateObj) {
        let eventObj = {
          eventType: x.eventType,
          guest: x.guest,
          startDateObj: x.startDateObj,
          endDateObj: x.endDateObj._d
        }
        eventObjList.push(eventObj);
      }
      else if (x.endDateObj && x.startDateObj) {
        let eventObj = {
          eventType: x.eventType,
          guest: x.guest,
          startDateObj: x.startDateObj,
          endDateObj: x.endDateObj
        }
        eventObjList.push(eventObj);
      }
    })


    let clientinquiryModelObj = {
      name: this.clientinquiryDataForm.controls.name.value,
      email: this.clientinquiryDataForm.controls.email.value,
      primaryContact: this.clientinquiryDataForm.controls.primaryContact.value,
      secondryContact: this.clientinquiryDataForm.controls.secondryContact.value,
      address: this.clientinquiryDataForm.controls.address.value,
      events: eventObjList
    };

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
