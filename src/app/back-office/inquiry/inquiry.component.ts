import { Component, OnInit, ViewChild } from "@angular/core";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { CommonService } from "app/shared/common.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import * as moment from 'moment';
import { Router } from "@angular/router";


declare const $: any;
@Component({
  selector: "app-inquiry",
  templateUrl: "./inquiry.component.html",
  styleUrls: ["./inquiry.component.css"],
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

  date = new Date();
  currentMonth = this.date.getMonth() + 1;
  currentYear = this.date.getFullYear();
  inquiryList: any[] = [];
  inquiryForm: FormGroup;
  eventActiveList: any;
  noData: boolean;
  inquiryListByDate: any[] = [];

  startDateObj: any;
  endDateObj: any;

  collapse = {}

  tabClick(tab) {
    this.activeTab = tab;
    if (this.activeTab == 1) {
      this.searchedMonth = this.currentMonth;
      this.searchedYear = this.currentYear;
      this.getInquiryList({ month: this.searchedMonth, year: this.searchedYear, name: this.searchedName })
    }
    else if (this.activeTab == 2) {
      let month = new Date().toJSON();

      this.searchedMonth = month.split('T')[0].split('-')[1];
      // this.searchedMonth = this.currentMonth;
      this.searchedYear = this.currentYear;
      this.getInquiryListForCalenderView({ month: this.searchedMonth, year: this.searchedYear })
    }
  }

  constructor(public adminLayoutService: AdminLayoutService, public fb: FormBuilder, public router: Router, public commonService: CommonService) { }

  ngOnInit(): void {
    this.l = 10;
    this.defaultForm();
    this.getEventActiveList()
    this.getYear();
    this.minEndDate = new Date();

    this.tabClick(this.activeTab);
  }


  // calender view
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  // Inquiry List
  inquiryEvent = [];
  // inquiryEvent = [
  //   {
  //     borderColor: "#FFF0",
  //     color: "#e7e7ff",
  //     date: "10-8-2022",
  //     textColor: "#00adef",
  //     title: "1 Inquiry Pendding",
  //   }
  // ];
  // inquiryEvent = [
  //   {
  //     'id': '123', 'title': '10 Inquiry', 'start': '2022-08-01', 'end': '2022-08-02', 'textColor': '#378006', 'borderColor': '#FFF0', 'color': '#37800666'
  //   },
  //   // {
  //   //   'id': '123', 'title': 'Hardik Event', 'start': '2022-08-01', 'constraint': "availableForMeeting", 'end': '2022-08-02', 'display': "background", 'color': 'red'
  //   // },
  //   {
  //     'id': '124', 'title': 'dharmesh Event', 'start': '2022-08-04', 'end': '2022-08-06', 'color': '#37800666', extendedProps: {
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

  // calender view list data
  getInquiryListForCalenderView(data: any) {

    let inquiryObj = {
      month: data.month,
      year: data.year,
    }

    this.adminLayoutService.getInquiryListForCalenderView(inquiryObj).subscribe((response: any) => {
      if (response.meta.code == 200) {

        this.inquiryEvent = [];
        this.inquiryEvent = response.data;

        this.calendarOptions = {
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'title today prev,next',
            center: '',
            right: 'myCustomButton'
          },
          businessHours: false, // display business hours
          editable: true,
          selectable: true,
          dateClick: this.handleDateClick.bind(this),
          events: this.inquiryEvent,
          eventClick: this.eventClickFunction.bind(this),
          customButtons: {
            myCustomButton: {
              text: 'Table View',
              click: this.customeButton.bind(this)
            },
            next: {
              click: this.nextMonth.bind(this)
            },
            prev: {
              click: this.prevMonth.bind(this)
            }
          },
        }
      }
      else {
        this.inquiryEvent = [];
      }
    })

  }
  addInquiryByDate() {
    if (!!this.startDateObj && !!this.endDateObj) {
      $('#add-inquiry-modal').modal('hide');
      this.router.navigate(["/admin/add-inquiry"], {
        queryParams: {
          startDate: this.startDateObj,
          endDate: this.endDateObj
        }
      })
    }
  }

  cancelInquiryByDate() {
    $('#add-inquiry-modal').modal('hide');
  }

  customeButton(customButton) {
    this.tabClick(1);
  }

  // date selction through open popup
  handleDateClick(arg) {
    $('#add-inquiry-modal').modal('show');
  }

  // For Next Month Click
  nextMonth(): void {

    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
    let month = calendarApi.currentData.currentDate.toJSON();

    this.searchedMonth = month.split('T')[0].split('-')[1];
    this.searchedYear = calendarApi.currentData.currentDate.getFullYear();
    this.getInquiryListForCalenderView({ month: this.searchedMonth, year: this.searchedYear });
    // console.log(calendarApi)
  }

  // For Prev Month Click
  prevMonth(): void {

    let calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();

    let month = calendarApi.currentData.currentDate.toJSON();

    this.searchedMonth = month.split('T')[0].split('-')[1];
    this.searchedYear = calendarApi.currentData.currentDate.getFullYear();
    this.getInquiryListForCalenderView({ month: this.searchedMonth, year: this.searchedYear });
    // console.log(calendarApi)
  }

  // all data get by date wise given thorugh api 
  eventClickFunction(eventInformation) {
    debugger
    let inquiryObj = {

      date: eventInformation.event._def.extendedProps.date
    }

    this.adminLayoutService.getInquiryListByDate(inquiryObj).subscribe((response: any) => {
      this.inquiryListByDate = [];
      if (response.meta.code == 200) {
        this.inquiryListByDate = response.data;
        for (let i = 0; i < this.inquiryListByDate.length; i++) {
          this.collapse[i] = false;
        }
        this.noData = false;
      }
      else {
        this.noData = true;
      }
    })
    console.log(eventInformation.event.extendedProps);
    $('#inquiry-details-by-date-modal').modal('show')
  }



  // get month and year wise api call and get data

  yearArray = new Array<number>();
  monthArray = [
    { value: 1, month: 'January' },
    { value: 2, month: 'February' },
    { value: 3, month: 'March' },
    { value: 4, month: 'April' },
    { value: 5, month: 'May' },
    { value: 6, month: 'June' },
    { value: 7, month: 'July' },
    { value: 8, month: 'August' },
    { value: 9, month: 'September' },
    { value: 10, month: 'October' },
    { value: 11, month: 'November' },
    { value: 12, month: 'December' },
  ];

  getYear() {
    this.yearArray = new Array<number>();
    let d = new Date();
    let nowYear = 2022;

    for (let index = 0; index < 50; index++) {
      let prYear = d.getFullYear();
      // let prYear = 2024;
      let arr = prYear - index;
      if (arr >= nowYear) {
        this.yearArray.push(arr)
      }
    }
    return this.yearArray;
  }

  getInquiryList(data: any) {

    let inquiryObj = {
      month: data.month,
      year: data.year,
      name: data.name
    }

    this.adminLayoutService.getInquiryList(inquiryObj).subscribe((response: any) => {
      if (response.meta.code == 200) {
        // response.data.forEach((x: any) => {
        //   let Obj = {
        //     _id: x._id,
        //     eventType: x.eventType,
        //     guest: x.guest,
        //     startDateObj: moment(x.startDateObj).format('DD/MM/yyyy hh:MM:ss a'),
        //     // startDateObj: x.startDateObj,
        //     endDateObj: x.endDateObj,
        //     name: x.name,
        //     email: x.email,
        //     primaryContact: x.primaryContact,
        //     secondryContact: x.secondryContact,
        //     address: x.address,
        //     approvalStatus: x.approvalStatus,
        //     status: x.status,
        //     eventName: x.eventName,
        //   }
        //   this.inquiryList.push(Obj);
        // })
        this.inquiryList = [];
        this.inquiryList = response.data;
        this.noData = false;
      }
      else {
        this.inquiryList = [];
        this.noData = true;
      }
    })

  }

  searchFilterInquiryList() {
    this.getInquiryList({ month: this.searchedMonth, year: this.searchedYear, name: this.searchedName })
  }



  // status update of event
  inquiryStatus(paramsObj) {
    let statusInquiryModelObj = {
      _id: paramsObj.id,
      status: paramsObj.status,
    };

    this.adminLayoutService.StatusInquiry(statusInquiryModelObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getInquiryList({ month: this.searchedMonth, year: this.searchedYear, name: this.searchedName })
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
    $('#edit-inquiry-modal').modal('show')

  }

  updateClientInquiry() {

    if (this.inquiryForm.invalid) {
      return
    }

    let inquiryObj = Object.assign({}, this.inquiryForm.getRawValue());

    this.adminLayoutService.updateClientinquiry(inquiryObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getInquiryList({ month: this.searchedMonth, year: this.searchedYear, name: this.searchedName })
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

  viewInquiryDetails(id: any) {

  }


}
