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
  referenceActiveList: any[] = [];
  inquiryId: any;
  viewInquiry: boolean = false;
  viewInquiryFormArray = {};
  assignpartyplotList: any[] = [];
  //calender done

  get fclientinquiryData() {
    return this.clientinquiryDataForm.controls;
  }
  submittedclientInquiryData = false;

  constructor(public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService, private router: Router, public route: ActivatedRoute) {

    const currentUrl = this.router.url
    if (currentUrl.includes('view-inquiry')) {
      this.route.params.subscribe((params: Params) => {
        this.inquiryId = params.id;

      });
      this.viewInquiry = true;
    } else if (currentUrl.includes('add-inquiry')) {
      this.route.queryParams.subscribe((queryParams) => {

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
  }

  ngOnInit(): void {
    this.defaultForm();
    this.getTimeRanges();
    this.getAssignPartyplotList();
    this.getEventActiveList();
    this.activeReferenceList();
    this.minEndDate[0] = new Date();
    this.eventList = this.clientinquiryDataForm.get("events") as FormArray;
    if (this.viewInquiry !== true) {
      this.eventList.push(this.createeventItem({}));
    } else if (this.viewInquiry === true) {
      this.editClientInquiry();
    }


  }

  defaultForm() {
    this.clientinquiryDataForm = this.fb.group({
      _id: ["0"],
      name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      primaryContact: ["", [Validators.required]],
      secondryContact: [""],
      address: ["", [Validators.required]],
      reference_ID: [null, [Validators.required]],
      reference_detail: [""],
      partyplot_ID: [null],
      events: this.fb.array([]),
    });
  }

  createeventItem(oItem?: any): FormGroup {
    return this.fb.group({
      _id: [(oItem['_id'] ? oItem['_id'] : '0')],
      eventType: [(oItem['eventType'] ? oItem['eventType'] : null)],
      guest: [(oItem['guest'] ? oItem['guest'] : '')],
      Date: [(oItem['Date'] ? oItem['Date'] : !!this.selectedDate ? new Date(this.selectedDate) : '')],
      // startDateObj: [(oItem['startDateObj'] ? oItem['startDateObj'] : !!this.selectedDate ? new Date(this.selectedDate) : '')],
      // endDateObj: [(oItem['endDateObj'] ? oItem['endDateObj'] : !!this.selectedDate ? new Date(this.selectedDate) : '')],
      startTimeObj: [(oItem['startTimeObj'] ? oItem['startTimeObj'] : null)],
      endTimeObj: [(oItem['endTimeObj'] ? oItem['endTimeObj'] : null)],
      offer_budget: [(oItem['offer_budget'] ? oItem['offer_budget'] : '')],
      client_budget: [(oItem['client_budget'] ? oItem['client_budget'] : '')],
      remark: [(oItem['remark'] ? oItem['remark'] : '')],
    });
  }
  timeRange = [];
  getTimeRanges() {
    let date = new Date();
    for (let minutes = 0; minutes < 24 * 60; minutes = minutes + 30) {
      date.setHours(0);
      date.setMinutes(minutes);
      let time = {
        value: moment(date).format('HH:mm'),
        name: moment(date).format('hh:mm A')
      }
      this.timeRange.push(time);
    }
  }

  getAssignPartyplotList() {
    this.adminLayoutService.assignpartyplotUserWiseList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.assignpartyplotList = Response.data;
        this.clientinquiryDataForm.controls.partyplot_ID.setValue(Response.data[0]._id);
      }
      //for select sub industry step
    },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  enableOnlyClientInquiryInput() {
    this.clientinquiryDataForm.controls['name'].enable();
    this.clientinquiryDataForm.controls['email'].enable();
    this.clientinquiryDataForm.controls['primaryContact'].enable();
    this.clientinquiryDataForm.controls['secondryContact'].enable();
    this.clientinquiryDataForm.controls['address'].enable();
    this.clientinquiryDataForm.controls['reference_ID'].enable();
    this.clientinquiryDataForm.controls['reference_detail'].enable();
    this.clientinquiryDataForm.controls['partyplot_ID'].enable();
    this.viewInquiry = false;
  }
  diableOnlyClientInquiryInput() {
    this.clientinquiryDataForm.controls['name'].disable();
    this.clientinquiryDataForm.controls['email'].disable();
    this.clientinquiryDataForm.controls['primaryContact'].disable();
    this.clientinquiryDataForm.controls['secondryContact'].disable();
    this.clientinquiryDataForm.controls['address'].disable();
    this.clientinquiryDataForm.controls['reference_ID'].disable();
    this.clientinquiryDataForm.controls['reference_detail'].disable();
    this.clientinquiryDataForm.controls['partyplot_ID'].disable();
    this.viewInquiry = true;
  }
  enableClientInquiryEventIndexWise(index: any) {
    (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['eventType'].enable());
    (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['guest'].enable());
    (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['Date'].enable());
    (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['startTimeObj'].enable());
    (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['endTimeObj'].enable());
    (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['offer_budget'].enable());
    (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['client_budget'].enable());
    (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['remark'].enable());
    this.viewInquiryFormArray[index] = false;
  }
  disableClientInquiryEventIndexWise(index: any) {

    if ((((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['_id'].value) == '0') {
      const remove = this.eventList;
      remove.removeAt(index)
    }
    else {
      (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['eventType'].disable());
      (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['guest'].disable());
      (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['Date'].disable());
      (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['startTimeObj'].disable());
      (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['endTimeObj'].disable());
      (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['offer_budget'].disable());
      (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['client_budget'].disable());
      (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['remark'].disable());
      this.viewInquiryFormArray[index] = true;
      this.editClientInquiry();
    }

  }

  activeReferenceList() {
    this.adminLayoutService.getReferenceActiveList().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.referenceActiveList = Response.data
        }
      });
  }

  onStartDateChange(data: any, index: any) {
    this.minEndDate[index] = data._d;
    (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['endDateObj'].setValue(data._d));
  }

  onStartTimeChange(time: any, index: any) {

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



  addEventList() {
    debugger

    this.eventList.push(this.createeventItem({}));
    this.viewInquiryFormArray[this.eventList.length - 1] = false
  }



  saveClientInquiry() {

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

    let eventObjList = [];
    this.clientinquiryDataForm.controls.events.value.map((x: any) => {
      debugger
      let date = moment(x.Date).format('yyyy-MM-DD')
      let startDateObj: any
      let endDateObj: any;

      startDateObj = new Date(date + ' ' + x.startTimeObj);
      endDateObj = new Date(date + ' ' + x.endTimeObj);
      let eventObj = {
        "eventType": x.eventType,
        "startDateObj": startDateObj,
        "endDateObj": endDateObj,
        "guest": x.guest,
        "client_budget": x.client_budget,
        "offer_budget": x.offer_budget,
        "remark": x.remark,
      }
      eventObjList.push(eventObj);
    });
    let clientinquiryModelObj = {
      name: this.clientinquiryDataForm.controls.name.value,
      email: this.clientinquiryDataForm.controls.email.value,
      primaryContact: this.clientinquiryDataForm.controls.primaryContact.value,
      secondryContact: this.clientinquiryDataForm.controls.secondryContact.value,
      address: this.clientinquiryDataForm.controls.address.value,
      reference_ID: this.clientinquiryDataForm.controls.reference_ID.value,
      reference_detail: this.clientinquiryDataForm.controls.reference_detail.value,
      partyplot_ID: this.clientinquiryDataForm.controls.partyplot_ID.value,
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

  editClientInquiry() {
    let inquiryId = { '_id': this.inquiryId }
    this.adminLayoutService.getInquiryById(inquiryId).subscribe((Response: any) => {
      if (Response.meta.code == 200) {

        this.defaultForm();
        this.eventList = '';
        this.eventList = this.clientinquiryDataForm.get("events") as FormArray;

        this.clientinquiryDataForm.controls._id.setValue(Response.data._id);
        this.clientinquiryDataForm.controls.name.setValue(Response.data.name);
        this.clientinquiryDataForm.controls.email.setValue(Response.data.email);
        this.clientinquiryDataForm.controls.primaryContact.setValue(Response.data.primaryContact);
        this.clientinquiryDataForm.controls.secondryContact.setValue(Response.data.secondryContact);
        this.clientinquiryDataForm.controls.address.setValue(Response.data.address);
        this.clientinquiryDataForm.controls.reference_ID.setValue(Response.data.reference_ID);
        this.clientinquiryDataForm.controls.partyplot_ID.setValue(Response.data.partyplot_ID);
        this.clientinquiryDataForm.controls.reference_detail.setValue(Response.data.reference_detail);

        Response.data.EventInquiryData.forEach((x: any, index: any) => {
          let startDateTime = new Date(x.startDateObj);
          let endDateTime = new Date(x.endDateObj);
          let eventObj = {
            _id: x._id,
            eventType: x.eventType,
            guest: x.guest,
            Date: new Date(x.startDateObj),
            startTimeObj: moment(startDateTime).format('HH:mm'),
            endTimeObj: moment(endDateTime).format('HH:mm'),
            offer_budget: x.offer_budget,
            client_budget: x.client_budget,
            remark: x.client_budget
          }
          this.viewInquiryFormArray[index] = true
          this.eventList.push(this.createeventItem(eventObj));
        })

        // this.diableOnlyClientInquiryInput();
        this.clientinquiryDataForm.disable();

      }
    });
  }

  updateClientInquiryData() {
    let clientinquiryModelObj = {
      _id: this.clientinquiryDataForm.controls._id.value,
      name: this.clientinquiryDataForm.controls.name.value,
      email: this.clientinquiryDataForm.controls.email.value,
      primaryContact: this.clientinquiryDataForm.controls.primaryContact.value,
      secondryContact: this.clientinquiryDataForm.controls.secondryContact.value,
      address: this.clientinquiryDataForm.controls.address.value,
      reference_ID: this.clientinquiryDataForm.controls.reference_ID.value,
      partyplot_ID: this.clientinquiryDataForm.controls.partyplot_ID.value,
      reference_detail: this.clientinquiryDataForm.controls.reference_detail.value
    };
    this.adminLayoutService.updateClientinquiryData(clientinquiryModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.diableOnlyClientInquiryInput()
          this.editClientInquiry();
        }
      })
  }

  deletEventList(index: number) {
    let _id = (((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['_id'].value);
    let deleteIdObj = {
      _id: _id
    }
    this.adminLayoutService.deleteEventByID(deleteIdObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.editClientInquiry();
          this.disableClientInquiryEventIndexWise(index);
        }
      }
    )
  }

  saveUpdateEventInquiryData(index: number) {

    let event = ((this.clientinquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup)
    let date = moment(event.controls['Date'].value).format('yyyy-MM-DD')
    let startDateObj: any
    let endDateObj: any;

    startDateObj = new Date(date + ' ' + event.controls['startTimeObj'].value);
    endDateObj = new Date(date + ' ' + event.controls['endTimeObj'].value);

    if (event.controls['_id'].value == '0') {
      let EventObj = {
        "clientInquiryId": this.inquiryId,
        "eventType": event.controls['eventType'].value,
        "startDateObj": startDateObj,
        "endDateObj": endDateObj,
        "guest": event.controls['guest'].value,
        "client_budget": event.controls['client_budget'].value,
        "offer_budget": event.controls['offer_budget'].value,
        "remark": event.controls['remark'].value,
      }
      this.adminLayoutService.saveEventInquiryData(EventObj).subscribe(
        (Response: any) => {
          if (Response.meta.code == 200) {
            this.editClientInquiry();
            this.disableClientInquiryEventIndexWise(index);
          }
        }
      )
    }
    else {
      let EventObj = {
        "_id": event.controls['_id'].value,
        "eventType": event.controls['eventType'].value,
        "startDateObj": startDateObj,
        "endDateObj": endDateObj,
        "guest": event.controls['guest'].value,
        "client_budget": event.controls['client_budget'].value,
        "offer_budget": event.controls['offer_budget'].value,
        "remark": event.controls['remark'].value,
      }
      this.adminLayoutService.updateEventInquiryData(EventObj).subscribe(
        (Response: any) => {
          if (Response.meta.code == 200) {
            this.editClientInquiry();
            this.disableClientInquiryEventIndexWise(index);
          }
        }
      )
    }
  }

}
