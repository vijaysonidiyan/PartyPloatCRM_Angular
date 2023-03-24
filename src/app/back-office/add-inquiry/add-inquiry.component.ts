import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, ThemePalette, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';


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
  eventInquiryDataForm: FormGroup | any;
  submittedAddInquiryData = {};
  invailidTime = {};
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
  updateInquiry: boolean = false;
  viewInquiryFormArray = {};
  assignpartyplotList: any[] = [];
  selectedPartyplot: any;
  eventListbyPartyplot: any;
  inquiryDate: string;
  //calender done

  get fclientinquiryData() {
    return this.clientinquiryDataForm.controls;
  }
  submittedclientInquiryData = false;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  toDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');

  constructor(private datePipe: DatePipe, public adminLayoutService: AdminLayoutService, private fb: FormBuilder, public commonService: CommonService, private router: Router, public route: ActivatedRoute) {
    this.defaultForm();
    this.defaultEventForm();
    this.eventList = this.eventInquiryDataForm.get("events") as FormArray;
    let pagePermission = { module: "inquiry" }
    this.getAssignPartyplotList();
    this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {

      if (Response.meta.code == 200) {

        this.isView = Response.data.isView;
        this.isCreated = Response.data.isCreated;
        this.isUpdated = Response.data.isUpdated;
        this.isDeleted = Response.data.isDeleted;

        const currentUrl = this.router.url
        if (currentUrl.includes('view-inquiry')) {
          this.route.params.subscribe((params: Params) => {
            this.inquiryId = params.id;
            if (this.isView === false) {
              this.router.navigate(['admin/inquiry/calender-view']);
            }
          });
          this.updateInquiry = true;
          this.viewInquiry = true;
          this.editClientInquiry();
        } else if (currentUrl.includes('add-inquiry')) {
          if (this.isCreated === false) {
            this.router.navigate(['admin/inquiry/calender-view']);
          }
          this.route.queryParams.subscribe((queryParams) => {
            this.updateInquiry = false;
            this.selectedPartyplot = queryParams.partyplotId;
            this.clientinquiryDataForm.controls.partyplot_ID.setValue(this.selectedPartyplot);
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
            this.eventList.push(this.createeventItem({}));
            (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[0] as FormGroup).controls['fullday_event'].setValue(true));
            (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[0] as FormGroup).controls['startTimeObj'].disable());
            (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[0] as FormGroup).controls['endTimeObj'].disable());
            this.eventList.value.forEach((x: any, index: any) => {
              let validation = (this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup;
              validation.get('Date').setValidators([Validators.required]);
              validation.get('eventType').setValidators([Validators.required]);
              validation.get('guest').setValidators([Validators.required]);
              validation.get('startTimeObj').setValidators([Validators.required]);
              validation.get('endTimeObj').setValidators([Validators.required]);
              validation.get('offer_budget').setValidators([Validators.required]);
              validation.get('client_budget').setValidators([Validators.required]);
              validation.get('Date').disable();

            })
          });
        }
      } else {
        this.router.navigate(['admin/dashboard']);
      }
    }, (error) => {
      console.log(error.error.Message);
    });
  }

  ngOnInit(): void {
    this.getTimeRanges();
    this.activeReferenceList();

    this.minEndDate[0] = new Date();
    // if (this.viewInquiry !== true) {
    //   this.eventList.push(this.createeventItem({}));
    //   (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[0] as FormGroup).controls['fullday_event'].setValue(true));
    //   (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[0] as FormGroup).controls['startTimeObj'].disable());
    //   (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[0] as FormGroup).controls['endTimeObj'].disable());
    //   this.eventList.value.forEach((x: any, index: any) => {
    //     let validation = (this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup;
    //     validation.get('Date').setValidators([Validators.required]);
    //     validation.get('eventType').setValidators([Validators.required]);
    //     validation.get('guest').setValidators([Validators.required]);
    //     validation.get('startTimeObj').setValidators([Validators.required]);
    //     validation.get('endTimeObj').setValidators([Validators.required]);
    //     validation.get('offer_budget').setValidators([Validators.required]);
    //     validation.get('client_budget').setValidators([Validators.required]);
    //     validation.get('Date').disable();

    //   })
    // } else if (this.viewInquiry === true) {
    //   this.editClientInquiry();
    // }

  }

  defaultForm() {
    this.clientinquiryDataForm = this.fb.group({
      _id: ["0"],
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.pattern(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/)]],
      primaryContact: ["", [Validators.required]],
      secondryContact: [""],
      address: ["", [Validators.required]],
      reference_ID: [null, [Validators.required]],
      reference_detail: [""],
      partyplot_ID: [null, [Validators.required]],

    });

  }
  defaultEventForm() {
    this.eventInquiryDataForm = this.fb.group({
      events: this.fb.array([]),
    })
  }

  createeventItem(oItem?: any): FormGroup {
    return this.fb.group({
      _id: [(oItem['_id'] ? oItem['_id'] : '0')],
      eventType: [(oItem['eventType'] ? oItem['eventType'] : null)],
      guest: [(oItem['guest'] ? oItem['guest'] : '')],
      Date: [(oItem['Date'] ? oItem['Date'] : !!this.selectedDate ? new Date(this.selectedDate) : '')],
      // startDateObj: [(oItem['startDateObj'] ? oItem['startDateObj'] : !!this.selectedDate ? new Date(this.selectedDate) : '')],
      // endDateObj: [(oItem['endDateObj'] ? oItem['endDateObj'] : !!this.selectedDate ? new Date(this.selectedDate) : '')],
      fullday_event: [(oItem['fullday_event'] ? oItem['fullday_event'] : false)],
      startTimeObj: [(oItem['startTimeObj'] ? oItem['startTimeObj'] : '06:00')],
      endTimeObj: [(oItem['endTimeObj'] ? oItem['endTimeObj'] : '22:00')],
      offer_budget: [(oItem['offer_budget'] ? oItem['offer_budget'] : '')],
      client_budget: [(oItem['client_budget'] ? oItem['client_budget'] : '')],
      remark: [(oItem['remark'] ? oItem['remark'] : '')],
      approvestatus: [(oItem['approvestatus'] ? oItem['approvestatus'] : 1)],
    });
  }
  timeRange = [];
  getTimeRanges() {
    let date = new Date();
    for (let minutes = 0; minutes < 24 * 60; minutes = minutes + 30) {
      date.setHours(6);
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
        if (!!this.selectedPartyplot) {
          this.clientinquiryDataForm.controls.partyplot_ID.setValue(this.selectedPartyplot);
        } else {
          this.clientinquiryDataForm.controls.partyplot_ID.setValue(Response.data[0]._id);
        }
        this.getEventList();

      }
      //for select sub industry step
    },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  dayTypeEvent({ checked, index }) {
    let eventInquiryFormGroup = (this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup
    if (checked === true) {
      eventInquiryFormGroup.controls['startTimeObj'].setValue('06:00');
      eventInquiryFormGroup.controls['endTimeObj'].setValue('22:00');
      eventInquiryFormGroup.controls['startTimeObj'].disable();
      eventInquiryFormGroup.controls['endTimeObj'].disable();
    } else {
      eventInquiryFormGroup.controls['startTimeObj'].enable();
      eventInquiryFormGroup.controls['endTimeObj'].enable();
    }
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
    let clientId = {
      _id: this.clientinquiryDataForm.controls._id.value
    }
    this.adminLayoutService.getClientDetailsByInquiryId(clientId).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.clientinquiryDataForm.controls._id.setValue(Response.data[0]._id);
          this.clientinquiryDataForm.controls.name.setValue(Response.data[0].name);
          this.clientinquiryDataForm.controls.email.setValue(Response.data[0].email);
          this.clientinquiryDataForm.controls.primaryContact.setValue(Response.data[0].primaryContact);
          this.clientinquiryDataForm.controls.secondryContact.setValue(Response.data[0].secondryContact);
          this.clientinquiryDataForm.controls.address.setValue(Response.data[0].address);
          this.clientinquiryDataForm.controls.reference_ID.setValue(Response.data[0].reference_ID);
          this.clientinquiryDataForm.controls.partyplot_ID.setValue(Response.data[0].partyplot_ID);
          this.clientinquiryDataForm.controls.reference_detail.setValue(Response.data[0].reference_detail);
        }
      })
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
    (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['eventType'].enable());
    (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['guest'].enable());
    (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['fullday_event'].enable());
    if (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['fullday_event'].value === true) {
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['startTimeObj'].disable());
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['endTimeObj'].disable());
    } else {
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['startTimeObj'].enable());
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['endTimeObj'].enable());
    }
    (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['offer_budget'].enable());
    (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['client_budget'].enable());
    (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['remark'].enable());
    this.viewInquiryFormArray[index] = false;
  }
  disableClientInquiryEventIndexWise(index: any) {

    if ((((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['_id'].value) == '0') {
      let validation = (this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup;
      validation.get('Date').clearValidators();
      validation.get('eventType').clearValidators();
      validation.get('guest').clearValidators();
      validation.get('startTimeObj').clearValidators();
      validation.get('endTimeObj').clearValidators();
      validation.get('offer_budget').clearValidators();
      validation.get('client_budget').clearValidators();
      const remove = this.eventList;
      remove.removeAt(index);
    }
    else {
      let EventId = {
        _id: (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['_id'].value)
      }
      this.adminLayoutService.getEventDetailsByInquiryId(EventId).subscribe(
        (x: any) => {
          if (x.meta.code == 200) {

            let startDateTime = new Date(x.data[0].startDateObj);
            let endDateTime = new Date(x.data[0].endDateObj);
            let setValueData = (this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup
            setValueData.controls['Date'].setValue(new Date(x.data[0].startDateObj));
            setValueData.controls['eventType'].setValue(x.data[0].eventType);
            setValueData.controls['_id'].setValue(x.data[0]._id);
            setValueData.controls['guest'].setValue(x.data[0].guest);
            setValueData.controls['client_budget'].setValue(x.data[0].client_budget);
            setValueData.controls['offer_budget'].setValue(x.data[0].offer_budget);
            setValueData.controls['remark'].setValue(x.data[0].remark);
            //setValueData.controls['status'].setValue(x.data[0].status);
            setValueData.controls['approvestatus'].setValue(x.data[0].approvestatus);
            setValueData.controls['fullday_event'].setValue(x.data[0].fullday_event);
            setValueData.controls['startTimeObj'].setValue(moment(moment(startDateTime).subtract(5, 'hour').subtract(30, 'minute').toJSON()).format('HH:mm'));
            setValueData.controls['endTimeObj'].setValue(moment(moment(endDateTime).subtract(5, 'hour').subtract(30, 'minute').toJSON()).format('HH:mm'));

            let validation = (this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup;
            validation.get('Date').setValidators([Validators.required]);
            validation.get('eventType').setValidators([Validators.required]);
            validation.get('guest').setValidators([Validators.required]);
            validation.get('startTimeObj').setValidators([Validators.required]);
            validation.get('endTimeObj').setValidators([Validators.required]);
            validation.get('offer_budget').setValidators([Validators.required]);
            validation.get('client_budget').setValidators([Validators.required]);



            // this.disableClientInquiryEventIndexWise(index);
          }
        });

      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['eventType'].disable());
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['guest'].disable());
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['Date'].disable());
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['fullday_event'].disable());
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['startTimeObj'].disable());
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['endTimeObj'].disable());
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['offer_budget'].disable());
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['client_budget'].disable());
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['remark'].disable());
      this.viewInquiryFormArray[index] = true;
      // this.editClientInquiry();
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

  getEventList() {
    let obj = {
      _id: this.clientinquiryDataForm.controls.partyplot_ID.value
    }
    this.adminLayoutService.geteventListbyPartyplot(obj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.eventListbyPartyplot = Response.data.eventsData;
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
    this.eventList.push(this.createeventItem({}));
    this.viewInquiryFormArray[this.eventList.length - 1] = false;
    (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[this.eventList.length - 1] as FormGroup).controls['Date'].disable());
    (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[this.eventList.length - 1] as FormGroup).controls['fullday_event'].setValue(true));
    (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[this.eventList.length - 1] as FormGroup).controls['startTimeObj'].disable());
    (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[this.eventList.length - 1] as FormGroup).controls['endTimeObj'].disable());

    if (this.viewInquiry == true) {
      (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[this.eventList.length - 1] as FormGroup).controls['Date'].setValue(this.selectedDate));
    }

    let validation = (this.eventInquiryDataForm.controls['events'] as FormArray).controls[this.eventList.length - 1] as FormGroup;
    validation.get('Date').setValidators([Validators.required]);
    validation.get('eventType').setValidators([Validators.required]);
    validation.get('guest').setValidators([Validators.required]);
    validation.get('startTimeObj').setValidators([Validators.required]);
    validation.get('endTimeObj').setValidators([Validators.required]);
    validation.get('offer_budget').setValidators([Validators.required]);
    validation.get('client_budget').setValidators([Validators.required]);
    // validation.get('remark').setValidators([Validators.required]);

  }
  saveClientInquiry() {
    let invailidTimeCount = 0;
    (this.eventInquiryDataForm.controls['events'] as FormArray).controls.map((x: any, index: any) => {
      let date = moment(x.controls.Date.value).format('yyyy-MM-DD')
      let startDateObj: any
      let endDateObj: any;
      let startTime = x.controls.startTimeObj.value
      let endTime = x.controls.endTimeObj.value

      startDateObj = new Date(date + ' ' + startTime);
      endDateObj = new Date(date + ' ' + endTime);
      if (startDateObj > endDateObj) {
        invailidTimeCount = invailidTimeCount + 1
        this.invailidTime[index] = true;
      } else {
        this.invailidTime[index] = false;
      }
    })
    if (this.clientinquiryDataForm.invalid || this.eventInquiryDataForm.invalid || invailidTimeCount > 0) {
      this.submittedclientInquiryData = true;
      (this.eventInquiryDataForm.controls['events'] as FormArray).controls.map((x: any, index: any) => {
        this.submittedAddInquiryData[index] = true;
      })
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
    this.eventInquiryDataForm.controls.events.controls.map((x: any) => {

      let date = moment(x.controls.Date.value).format('yyyy-MM-DD')
      let startDateObj: any
      let endDateObj: any;

      startDateObj = new Date(date + ' ' + x.controls.startTimeObj.value);
      endDateObj = new Date(date + ' ' + x.controls.endTimeObj.value);


      let eventObj = {
        "eventType": x.controls.eventType.value,
        "startDateObj": moment(startDateObj).add(5, 'hour').add(30, 'minute').toJSON(),
        "endDateObj": moment(endDateObj).add(5, 'hour').add(30, 'minute').toJSON(),
        "fullday_event": x.controls.fullday_event.value,
        "guest": x.controls.guest.value,
        "client_budget": x.controls.client_budget.value,
        "offer_budget": x.controls.offer_budget.value,
        "remark": x.controls.remark.value,
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
          this.getEventList();
          this.defaultForm();
          this.defaultEventForm();
          this.ISeditClientInquiry = false;
          this.commonService.notifier.notify("success", "Inquiry Saved Successfully.");
          this.router.navigate(["/admin/inquiry/calender-view"])
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
        this.defaultEventForm();
        this.clientinquiryDataForm.controls.partyplot_ID.setValue(Response.data.partyplot_ID);
        this.getEventList();
        this.eventList = '';
        this.eventList = this.eventInquiryDataForm.get("events") as FormArray;

        this.clientinquiryDataForm.controls._id.setValue(Response.data._id);
        this.clientinquiryDataForm.controls.name.setValue(Response.data.name);
        this.clientinquiryDataForm.controls.email.setValue(Response.data.email);
        this.clientinquiryDataForm.controls.primaryContact.setValue(Response.data.primaryContact);
        this.clientinquiryDataForm.controls.secondryContact.setValue(Response.data.secondryContact);
        this.clientinquiryDataForm.controls.address.setValue(Response.data.address);
        this.clientinquiryDataForm.controls.reference_ID.setValue(Response.data.reference_ID);
        this.clientinquiryDataForm.controls.reference_detail.setValue(Response.data.reference_detail);

        this.inquiryDate = this.datePipe.transform(new Date(Response.data.createdAt), 'dd/MM/yyyy, hh:mm a')
        Response.data.EventInquiryData.forEach((x: any, index: any) => {
          let Dates = new Date(x.startDateObj);
          let startDateTime = new Date(x.startDateObj);
          let endDateTime = new Date(x.endDateObj);
          let eventObj = {
            _id: x._id,
            eventType: x.eventType,
            guest: x.guest,
            fullday_event: x.fullday_event,
            Date: new Date(moment(Dates).subtract(5, 'hour').subtract(30, 'minute').toJSON()),
            startTimeObj: moment(moment(startDateTime).subtract(5, 'hour').subtract(30, 'minute').toJSON()).format('HH:mm'),
            endTimeObj: moment(moment(endDateTime).subtract(5, 'hour').subtract(30, 'minute').toJSON()).format('HH:mm'),
            offer_budget: x.offer_budget,
            client_budget: x.client_budget,
            remark: x.remark,
            approvestatus: x.approvestatus
          }
          this.selectedDate = new Date(x.startDateObj)
          this.viewInquiryFormArray[index] = true
          this.eventList.push(this.createeventItem(eventObj));

          let validation = (this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup;
          validation.get('Date').setValidators([Validators.required]);
          validation.get('eventType').setValidators([Validators.required]);
          validation.get('guest').setValidators([Validators.required]);
          validation.get('startTimeObj').setValidators([Validators.required]);
          validation.get('endTimeObj').setValidators([Validators.required]);
          validation.get('offer_budget').setValidators([Validators.required]);
          validation.get('client_budget').setValidators([Validators.required]);


        })

        // this.diableOnlyClientInquiryInput();
        this.clientinquiryDataForm.disable();
        this.eventInquiryDataForm.disable();

      }
    });
  }

  updateClientInquiryData() {

    if (this.clientinquiryDataForm.invalid) {
      this.submittedclientInquiryData = true
      return
    }

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
          this.diableOnlyClientInquiryInput();
          this.commonService.notifier.notify("success", "Inquiry Details Updated Successfully.")
        }
      })
  }

  deletEventList(index: number) {
    if ((this.eventInquiryDataForm.controls['events'] as FormArray).length <= 1) {
      this.commonService.notifier.notify("error", "Event Details is Required.")
      return
    }
    let _id = (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).controls['_id'].value);
    let deleteIdObj = {
      _id: _id
    }
    this.adminLayoutService.deleteEventByID(deleteIdObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.commonService.notifier.notify("success", "Event Details Deleted Successfully.")
          const remove = this.eventList;
          remove.removeAt(index)
          this.disableClientInquiryEventIndexWise(index);
        }
      }
    )
  }

  saveUpdateEventInquiryData(index: number) {

    if (((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup).invalid) {
      this.submittedAddInquiryData[index] = true;
      return;
    }

    let event = ((this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup)
    let date = moment(event.controls['Date'].value).format('yyyy-MM-DD')
    let startDateObj: any
    let endDateObj: any;

    startDateObj = new Date(date + ' ' + event.controls['startTimeObj'].value);
    endDateObj = new Date(date + ' ' + event.controls['endTimeObj'].value);

    if (event.controls['_id'].value == '0') {
      let EventObj = {
        "clientInquiryId": this.inquiryId,
        "eventType": event.controls['eventType'].value,
        "fullday_event": event.controls['fullday_event'].value,
        "startDateObj": moment(startDateObj).add(5, 'hour').add(30, 'minute').toJSON(),
        "endDateObj": moment(endDateObj).add(5, 'hour').add(30, 'minute').toJSON(),
        "guest": event.controls['guest'].value,
        "client_budget": event.controls['client_budget'].value,
        "offer_budget": event.controls['offer_budget'].value,
        "remark": event.controls['remark'].value,
      }
      this.adminLayoutService.saveEventInquiryData(EventObj).subscribe(
        (Response: any) => {
          if (Response.meta.code == 200) {
            this.commonService.notifier.notify("success", "Event Details Saved Successfully.")
            let setValueData = (this.eventInquiryDataForm.controls['events'] as FormArray).controls[index] as FormGroup
            setValueData.controls['_id'].setValue(Response.data._id);
            this.disableClientInquiryEventIndexWise(index);
          }
        }
      )
    }
    else {
      let EventObj = {
        "_id": event.controls['_id'].value,
        "eventType": event.controls['eventType'].value,
        "fullday_event": event.controls['fullday_event'].value,
        "startDateObj": moment(startDateObj).add(5, 'hour').add(30, 'minute').toJSON(),
        "endDateObj": moment(endDateObj).add(5, 'hour').add(30, 'minute').toJSON(),
        "guest": event.controls['guest'].value,
        "client_budget": event.controls['client_budget'].value,
        "offer_budget": event.controls['offer_budget'].value,
        "remark": event.controls['remark'].value,
      }
      this.adminLayoutService.updateEventInquiryData(EventObj).subscribe(
        (Response: any) => {
          if (Response.meta.code == 200) {
            this.disableClientInquiryEventIndexWise(index);
            this.commonService.notifier.notify("success", "Event Details Updated Successfully.")
          }
        }
      )
    }
  }

}
