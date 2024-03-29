import { Component, OnInit, ViewChild } from "@angular/core";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { CommonService } from "app/shared/common.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import * as moment from 'moment';
import { Router } from "@angular/router";

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
// import * as _moment from 'moment';
import { Moment} from 'moment';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

// const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

declare const $: any;
@Component({
  selector: "app-inquiry",
  templateUrl: "./inquiry.component.html",
  styleUrls: ["./inquiry.component.css"],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class InquiryComponent implements OnInit {
  activeTab = 2;
  monthList: any[] = [];
  yearList: any[] = [];
  staffList: any[];
  l: number;
  p: number = 1;
  eventList: any[] = [];
  partyplotList: any[] = [];
  searchedName = '';
  searchedYear = null;
  searchedMonth = null;
  searchedPartyplot = null;

  date = new Date();
  currentMonth = (this.date.getMonth() + 1).toString();
  currentYear = this.date.getFullYear();
  inquiryList: any[] = [];
  inquiryCalenderCheckEventList: any[] = [];
  inquiryForm: FormGroup;
  eventActiveList: any[] = [];
  assignpartyplotList: any[] = [];
  noData: boolean;
  inquiryListByDate: any[] = [];

  startDateObj = '';
  endDateObj: any;

  collapse = {}
  isEditViewInquiryDetails: boolean = false;
  cancelRemark = '';
  cancelInquiryForm: FormGroup;
  gotoDate: any;
  isInquiryTab: boolean = false;
  isBookedOrNot = {};
  invaildSearchList: boolean = false;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;
  isViewbookingConfirm: boolean;
  isCreatedbookingConfirm: boolean;
  isUpdatedbookingConfirm: boolean;
  isDeletedbookingConfirm: boolean;
  inquiryCancle: any;
  inquiryConfirm: any;
  inquiryPending: any;
  // tabClick(tab) {
  //   this.activeTab = tab;
  //   if (this.activeTab == 1) {


  //   }
  //   else if (this.activeTab == 2) {

  //     this.searchedMonth = this.currentMonth;
  //     this.searchedYear = this.currentYear;
  //     this.getInquiryListForCalenderView({ month: this.searchedMonth, year: this.searchedYear, partyplot_ID: this.searchedPartyplot })

  //   }
  // }

  constructor(private adminLayoutService: AdminLayoutService, private commonService: CommonService, private fb: FormBuilder, private router: Router) {
    let pagePermission = { module: "inquiry" }
    this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {

      if (Response.meta.code == 200) {

        this.isView = Response.data.isView;
        this.isCreated = Response.data.isCreated;
        this.isUpdated = Response.data.isUpdated;
        this.isDeleted = Response.data.isDeleted;
        if (this.isView === false) {
          this.router.navigate(['admin/dashboard']);
        }
      }
    }, (error) => {
      console.log(error.error.Message);
    });
    this.adminLayoutService.getpagePermission({ module: "bookingConfirm" }).subscribe((Response: any) => {

      if (Response.meta.code == 200) {

        this.isViewbookingConfirm = Response.data.isView;
        this.isCreatedbookingConfirm = Response.data.isCreated;
        this.isUpdatedbookingConfirm = Response.data.isUpdated;
        this.isDeletedbookingConfirm = Response.data.isDeleted;
      }
    })
    this.getAssignPartyplotList();
  }

  ngOnInit(): void {
    this.l = 10;
    this.defaultForm();
    this.defaultCancelInquiryForm();
    this.getEventActiveList();
    this.getYear();
    this.minEndDate = new Date();


  }


  // calender view
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  // Inquiry List
  inquiryEvent = [];
  // inquiryEvent = [
  //   {
  //     // backgroundColor: "#e8fadf",
  //     borderColor: "#e8fadf",
  //     color: "#e8fadf",
  //     date: "2022-09-26",
  //     textColor: "#71dd37",
  //     title: "2 Inquiry Confirm",
  //     display: 'background',
  //   }
  // ];
  // inquiryEvent = [
  //   {
  //     'id': '123', 'title': '10 Inquiry', 'start': '2022-09-01', 'end': '2022-09-02', 'backgroundColor': 'green', 'display': 'background', 'textColor': '#378006', 'borderColor': '#FFF0', 'color': '#37800666'
  //   },
  //   // {
  //   //   'id': '123', 'title': 'Hardik Event', 'start': '2022-08-01', 'constraint': "availableForMeeting", 'end': '2022-08-02', 'display': "background", 'color': 'red'
  //   // },
  //   {
  //     'id': '124', 'title': 'dharmesh Event', 'start': '2022-09-04', 'end': '2022-09-06', 'color': '#37800666', extendedProps: {
  //       id: 13,
  //       department: 'IT',
  //       course: 'BE'
  //     }
  //   }
  // ];

  events = [
    {
      title: "Inquiry",
      start: "2022-08-13T11:00:00",
      constraint: "availableForMeeting", // defined below
      color: 'green'
    },
    {
      title: "Party",
      start: "2022-08-29T20:00:00"
    },
  ]

  calendarOptions: CalendarOptions;

  partyplotChange() {
    this.getInquiryListForCalenderView({ month: this.searchedMonth, year: this.searchedYear, partyplot_ID: this.searchedPartyplot })
    localStorage.setItem('partyPlotId', this.searchedPartyplot)
  }

  // setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
  //   const ctrlValue = this.date.value!;
  //   ctrlValue.month(normalizedMonthAndYear.month());
  //   ctrlValue.year(normalizedMonthAndYear.year());
  //   this.date.setValue(ctrlValue);
  //   datepicker.close();
  // }

  goto(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.searchedMonth = normalizedMonthAndYear.month() +1 < 10 ? '0' + (normalizedMonthAndYear.month() + 1) : (normalizedMonthAndYear.month() + 1).toString();
    this.searchedYear = normalizedMonthAndYear.year();
    datepicker.close();
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(this.searchedYear +'-'+ this.searchedMonth +'-01');
    this.currentYear = this.searchedYear;
    this.currentMonth = this.searchedMonth;

    this.getInquiryListForCalenderView({ month: this.searchedMonth, year: this.searchedYear, partyplot_ID: this.searchedPartyplot });
     // call a method on the Calendar object
  }
  // calender view list data
  getInquiryListForCalenderView(data: any) {
    this.inquiryCancle = "0";
    this.inquiryConfirm = "0";
    this.inquiryPending = "0";

    let inquiryObj = {
      month: data.month ? data.month : null,
      year: data.year ? data.year : null,
      partyplot_ID: data.partyplot_ID ? data.partyplot_ID : null,
    }

    this.adminLayoutService.getInquiryListForCalenderView(inquiryObj).subscribe((response: any) => {

      if (response.meta.code == 200) {
        this.inquiryEvent = [];
        this.inquiryEvent = response.data.list;
        this.inquiryCancle = response.data.inquiry_cancle
        this.inquiryConfirm = response.data.inquiry_conform
        this.inquiryPending = response.data.inquiry_pending

      }
      else {
        this.inquiryEvent = [];
      }

      this.calendarOptions = {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next title',
          center: '',
          right: ''
        },
        showNonCurrentDates: false,
        initialDate: new Date(this.searchedYear + '-' + this.searchedMonth),
        businessHours: false, // display business hours
        dateClick: this.handleDateClick.bind(this),
        events: this.inquiryEvent,
        expandRows: true,
        eventClick: this.eventClickFunction.bind(this),
        contentHeight: "auto",
        customButtons: {
          // myCustomButton: {
          //   text: 'List',
          //   click: this.customeButton.bind(this)
          // },
          next: {
            click: this.nextMonth.bind(this)
          },
          prev: {
            click: this.prevMonth.bind(this)
          }
        },
      }
      //   let calendarApi = this.calendarComponent.getApi();
      // calendarApi.gotoDate(new Date(this.currentMonth + '-01-' + this.currentYear));
    })

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next title',
        center: '',
        right: ''
      },
      showNonCurrentDates: false,
      businessHours: false, // display business hours
      // editable: true,
      // selectable: true,
      dateClick: this.handleDateClick.bind(this),
      events: this.inquiryEvent,
      eventClick: this.eventClickFunction.bind(this),
      contentHeight: "auto",
      customButtons: {
        // myCustomButton: {
        //   text: 'List',
        //   click: this.customeButton.bind(this)
        // },
        next: {
          click: this.nextMonth.bind(this)
        },
        prev: {
          click: this.prevMonth.bind(this)
        }
      },
    }

    // let calendarApi = this.calendarComponent.getApi();
    // calendarApi.gotoDate(new Date(this.currentMonth + '-01-' + this.currentYear));
  }

  viewInquiry(id: any, type: any, bookingId: any) {
    $('#inquiry-details-by-date-modal').modal('hide');
    if (type == 2) {

      this.router.navigate(['admin/view-booking-confirm/' + bookingId]);
    }
    else if (type == 1) {
      this.router.navigate(["admin/inquiry/view-inquiry/" + id])
    }
  }
  viewInquiryBooking(clientIdForNavigation: any, status: any, inquiryBookingId: any) {
    if (status == 2) {
      this.router.navigate(['admin/view-booking-confirm/' + inquiryBookingId]);
    }
    else {
      this.router.navigate(["admin/inquiry/view-inquiry/" + clientIdForNavigation])
    }
  }
  bookingConfirmNavigation(id: any) {
    $('#inquiry-details-by-date-modal').modal('hide');
    this.router.navigate(['admin/booking-confirm/' + id]);
  }
  cancelBooking(id: any) {
    this.defaultCancelInquiryForm();
    this.cancelInquiryForm.controls._id.setValue(id);
    $('#cancel-booking-modal').modal('show');
    $('#inquiry-details-by-date-modal').modal('hide')
  }

  addInquiryByDate() {
    if (!!this.startDateObj) {

      // if (!!this.startDateObj && !!this.endDateObj) {
      $('#add-inquiry-modal').modal('hide');
      this.router.navigate(["/admin/add-inquiry"], {
        queryParams: {
          startDate: this.startDateObj,
          // endDate: this.endDateObj
        }
      })
    }
  }

  cancelInquiryByDate() {
    $('#add-inquiry-modal').modal('hide');
  }

  customeButton(customButton) {
    // this.tabClick(1);
  }

  // date selction through open popup
  handleDateClick(arg) {

    let obj = {
      date: moment(arg.date).format('DD/MM/yyyy'),
      partyplot_ID: this.searchedPartyplot
    }

    this.adminLayoutService.getCheckInquiryListData(obj).subscribe((Response: any) => {
      if (Response.meta.code == 2010) {
        // not inquiry
        if (this.isCreated === true) {
          let todayDate = moment(new Date()).format('yyyy-MM-DD');
          let argDate = moment(arg.date).format('yyyy-MM-DD');
          if (todayDate <= argDate) {
            this.router.navigate(["/admin/inquiry/add-inquiry"], {
              queryParams: {
                partyplotId: this.searchedPartyplot,
                startDate: arg.date,
                // endDate: this.endDateObj
              }
            })
          }
        }
      }
      else if (Response.meta.code == 2011) {
        // available inquiry
        let inquiryObj = {

          date: moment(arg.date).format('DD/MM/yyyy'),
          partyplot_ID: this.searchedPartyplot
        }

        this.getInquiryListByDateWise(inquiryObj);
      }

    })


  }

  // For Next Month Click
  nextMonth(): void {

    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
    let month = calendarApi.currentData.currentDate.toJSON();

    this.searchedMonth = month.split('T')[0].split('-')[1];
    this.searchedYear = calendarApi.currentData.currentDate.getFullYear();
    this.currentYear = this.searchedYear;
    this.currentMonth = this.searchedMonth;

    this.getInquiryListForCalenderView({ month: this.searchedMonth, year: this.searchedYear, partyplot_ID: this.searchedPartyplot });
    // console.log(calendarApi)
  }

  // For Prev Month Click
  prevMonth(): void {

    let calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();

    let month = calendarApi.currentData.currentDate.toJSON();
    this.searchedMonth = month.split('T')[0].split('-')[1];
    this.searchedYear = calendarApi.currentData.currentDate.getFullYear();

    this.currentYear = this.searchedYear;
    this.currentMonth = this.searchedMonth;

    this.getInquiryListForCalenderView({ month: this.searchedMonth, year: this.searchedYear, partyplot_ID: this.searchedPartyplot });
    // console.log(calendarApi)
  }

  // all data get by date wise given thorugh api 
  eventClickFunction(eventInformation) {
    let inquiryObj = {
      date: eventInformation.event._def.extendedProps.date,
      partyplot_ID: this.searchedPartyplot
    }
    this.getInquiryListByDateWise(inquiryObj);
  }

  getInquiryListByDateWise(params) {

    this.adminLayoutService.getInquiryListByDate(params).subscribe((response: any) => {
      this.inquiryListByDate = [];
      if (response.meta.code == 200) {
        this.inquiryListByDate = response.data;
        let bookingConfirmData = [];
        bookingConfirmData = response.data.filter((x: any) => x.approvestatus === 2)

        if (bookingConfirmData.length > 0) {
          this.inquiryListByDate.filter((x: any, index: any) => {
            bookingConfirmData.filter((y: any, yIndex: any) => {
              if (x.clientInquiryId == y.clientInquiryId) {
                this.isBookedOrNot[index] = true
              }
              else {
                this.isBookedOrNot[index] = false
              }
            })
          })
        }
        else {
          this.inquiryListByDate.filter((x: any, index: any) => {
            this.isBookedOrNot[index] = true
          })
        }



        for (let i = 0; i < this.inquiryListByDate.length; i++) {
          this.collapse[i] = false;
        }
        this.noData = false;
      }
      else {
        this.noData = true;
      }
    })
    $('#inquiry-details-by-date-modal').modal('show')
  }


  // get month and year wise api call and get data

  yearArray = new Array<number>();
  monthArray = [
    { value: '1', month: 'January' },
    { value: '2', month: 'February' },
    { value: '3', month: 'March' },
    { value: '4', month: 'April' },
    { value: '5', month: 'May' },
    { value: '6', month: 'June' },
    { value: '7', month: 'July' },
    { value: '8', month: 'August' },
    { value: '9', month: 'September' },
    { value: '10', month: 'October' },
    { value: '11', month: 'November' },
    { value: '12', month: 'December' },
  ];

  getYear() {
    this.yearArray = new Array<number>();
    let d = new Date();
    let toYear = d.getFullYear();
    let endYear = toYear + 5
    let startYear = 2022;

    for (let index = startYear; index <= endYear; index++) {
      this.yearArray.push(index)
    }
    return this.yearArray;
  }
  isBookedOrNotForListView = {}
  getInquiryList(data: any) {

    let inquiryObj = {
      month: data.month ? data.month : null,
      year: data.year ? data.year : null,
      name: data.name ? data.name : null,
      partyplot_ID: data.partyplot_ID ? data.partyplot_ID : null
    }

    this.inquiryList = [];
    this.adminLayoutService.getInquiryList(inquiryObj).subscribe((response: any) => {
      if (response.meta.code == 200) {

        this.inquiryList = response.data;

        let bookingConfirmData = [];
        bookingConfirmData = response.data.filter((x: any) => x.approvestatus === 2)

        if (bookingConfirmData.length > 0) {
          this.inquiryList.filter((x: any, index: any) => {
            bookingConfirmData.filter((y: any, yIndex: any) => {

              let xDate = moment(x.startDateObj).format("yyyy-MM-DD");
              let yDate = moment(y.startDateObj).format("yyyy-MM-DD")

              if (xDate == yDate) {
                if (x.partyplot_ID == y.partyplot_ID) {
                  if (x.clientInquiryId != y.clientInquiryId) {
                    this.isBookedOrNotForListView[index] = false;
                  }
                  else {
                    this.isBookedOrNotForListView[index] = true;
                  }
                }
                else {
                  this.isBookedOrNotForListView[index] = true;
                }
              }
              else {
                this.isBookedOrNotForListView[index] = true;
              }



              // if (x.clientInquiryId == y.clientInquiryId && x.partyplot_ID == y.partyplot_ID) {
              //   this.isBookedOrNotForListView[index] = true
              // }
              // else {
              //   this.isBookedOrNotForListView[index] = false
              // }
            })
          })
        }
        else {
          this.inquiryList.filter((x: any, index: any) => {
            this.isBookedOrNotForListView[index] = true
          })
        }

        console.log("isBookedOrNotForListView", this.isBookedOrNotForListView);

        this.noData = false;
      }
      else {
        this.inquiryList = [];
        this.noData = true;
      }
    })

  }


  searchFilterInquiryList() {
    this.currentYear = this.searchedYear;
    this.currentMonth = this.searchedMonth;
    if (this.searchedMonth != null && this.searchedYear == null) {
      this.invaildSearchList = true;
      return
    } else {
      this.invaildSearchList = false;
    }
    this.getInquiryList({ month: this.searchedMonth, year: this.searchedYear, name: this.searchedName, partyplot_ID: this.searchedPartyplot })
    localStorage.setItem('partyPlotId', this.searchedPartyplot)
  }



  // status update of event
  inquiryStatus(paramsObj) {
    let statusInquiryModelObj = {
      _id: paramsObj.id,
      status: paramsObj.status,
    };

    this.adminLayoutService.StatusInquiry(statusInquiryModelObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getInquiryList({ month: this.searchedMonth, year: this.searchedYear, name: this.searchedName, partyplot_ID: this.searchedPartyplot })
        this.commonService.notifier.notify("success", Response.meta.message);
      }
      else {
        this.commonService.notifier.notify("error", Response.meta.message);
      }
    },
      (error) => {
        console.log(error);
      }
    );
  }

  // update inquiry
  submittedclientInquiryData: boolean = false;
  get fclientinquiryData() {
    return this.inquiryForm.controls;
  }
  // calender
  // public date: moment.Moment;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate = new Date();
  public minEndDate = {};
  public maxDate: moment.Moment;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';

  getEventActiveList() {
    this.adminLayoutService.geteventActiveList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.eventActiveList = Response.data;
      }
      //for select sub industry step
    },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  getAssignPartyplotList() {
    this.adminLayoutService.assignpartyplotUserWiseList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.assignpartyplotList = Response.data;
        let partyPlotId = localStorage.getItem("partyPlotId")
        if (!!partyPlotId && partyPlotId != null && partyPlotId != "" && partyPlotId != "null") {
          let data = this.assignpartyplotList.filter((x: any) => x._id == partyPlotId)
          if (data) {
            this.searchedPartyplot = partyPlotId;
          } else {
            this.searchedPartyplot = Response.data[0]._id ? Response.data[0]._id : null;
            localStorage.setItem('partyPlotId', this.searchedPartyplot)
          }
        } else {
          this.searchedPartyplot = Response.data[0]._id ? Response.data[0]._id : null;
          localStorage.setItem('partyPlotId', this.searchedPartyplot)
        }
        const url = this.router.url;
        if (url.includes('inquiry/list-view')) {
          this.isInquiryTab = true;
          this.searchedMonth = this.currentMonth;
          this.searchedYear = this.currentYear;
          this.getInquiryList({ month: parseInt(this.searchedMonth), year: this.searchedYear, name: this.searchedName, partyplot_ID: this.searchedPartyplot })
        }
        else if (url.includes('calender-view')) {
          this.isInquiryTab = false;
          this.searchedMonth = this.currentMonth;
          this.searchedYear = this.currentYear;
          this.getInquiryListForCalenderView({ month: this.searchedMonth, year: this.searchedYear, partyplot_ID: this.searchedPartyplot })
        }
        // this.tabClick(this.activeTab);
      }
      //for select sub industry step
    },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  defaultForm() {
    this.inquiryForm = this.fb.group({
      _id: [""],
      name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      primaryContact: ["", [Validators.required]],
      secondryContact: ["", [Validators.required]],
      address: ["", [Validators.required]],
      eventType: [, [Validators.required]],
      guest: ["", [Validators.required]],
      startDateObj: ["", [Validators.required]],
      endDateObj: ["", [Validators.required]],
    })
  }

  onStartDateChange(data: any) {
    this.minEndDate = data._d;

    localStorage.setItem('startDateObj', data._d);
    this.inquiryForm.controls.endDateObj.setValue('');
  }

  editInquiryData(data: any) {
    // this.router.navigate(['/admin/inquiry/view-inquiry'], { queryParams: { id: data.clientInquiryId } }
    // );
    this.defaultForm();
    console.log(data);

    // set value in form
    this.inquiryForm.controls._id.setValue(data._id)
    this.inquiryForm.controls.name.setValue(data.name)
    this.inquiryForm.controls.email.setValue(data.email)
    this.inquiryForm.controls.primaryContact.setValue(data.primaryContact)
    this.inquiryForm.controls.secondryContact.setValue(data.secondryContact)
    this.inquiryForm.controls.address.setValue(data.address)
    this.inquiryForm.controls.eventType.setValue(data.eventType == '' ? null : data.eventType)
    this.inquiryForm.controls.guest.setValue(data.guest)
    this.inquiryForm.controls.startDateObj.setValue(data.startDateObj)
    this.inquiryForm.controls.endDateObj.setValue(data.endDateObj)

    this.isEditViewInquiryDetails = false;
    $('#edit-inquiry-modal').modal('show');
  }

  updateClientInquiry() {

    if (this.inquiryForm.invalid) {
      return
    }

    let inquiryObj = Object.assign({}, this.inquiryForm.getRawValue());

    this.adminLayoutService.updateClientinquiry(inquiryObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getInquiryList({ month: this.searchedMonth, year: this.searchedYear, name: this.searchedName, partyplot_ID: this.searchedPartyplot })
        this.commonService.notifier.notify("success", Response.meta.message);
        $('#edit-inquiry-modal').modal('hide')
      }
      else {
        this.commonService.notifier.notify("error", Response.meta.message);
      }
      //for select sub industry step
    },
      (error) => {
        console.log(error.error.Message);
      }
    );

  }

  collapseShow(inquiryIndex: any) {

    if (this.collapse[inquiryIndex] === true) {
      this.collapse[inquiryIndex] = false;
    }
    else {
      for (let i = 0; i < this.inquiryListByDate.length; i++) {
        this.collapse[i] = false;
      }
      this.collapse[inquiryIndex] = true;
    }
  }

  bookInquiry(status: any) {
    let obj = {
      _id: this.inquiryForm.value._id,
      approvalStatus: status
    }
    this.adminLayoutService.bookInquiryApproved(obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {

      }
    })
  }

  defaultCancelInquiryForm() {
    this.cancelInquiryForm = this.fb.group({
      _id: [''],
      approvestatus: [3],
      remark_status: ['']
    })
  }

  cancelBookingInquiry() {
    let remarkBookingObj = Object.assign({}, this.cancelInquiryForm.getRawValue())
    this.adminLayoutService.cancelBookingInquiry(remarkBookingObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {

        this.defaultCancelInquiryForm();
        this.getAssignPartyplotList();

        // this.tabClick(this.activeTab);
        $('#cancel-booking-modal').modal('hide');
      }
    })
  }


}
