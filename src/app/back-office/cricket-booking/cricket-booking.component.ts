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
  selector: 'app-cricket-booking',
  templateUrl: './cricket-booking.component.html',
  styleUrls: ['./cricket-booking.component.css']
})
export class CricketBookingComponent implements OnInit {
  // ischecked : boolean = false
  activeTab = 2;
  monthList: any[] = [];
  yearList: any[] = [];
  staffList: any[];
  l: number;
  p: number = 1;
  // eventList: any[] = [];
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


  constructor(private adminLayoutService: AdminLayoutService, private commonService: CommonService, private fb: FormBuilder, private router: Router) {
    let pagePermission = { module: "inquiry" }
    this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {
      debugger
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
      debugger
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
    this.getEventActiveList();
    this.getYear();
    this.minEndDate = new Date();
    

  }


  // calender view
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  // Inquiry List
  inquiryEvent = [];
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
  }

  // calender view list data
  getInquiryListForCalenderView(data: any) {


    let inquiryObj = {
      month: data.month ? data.month : null,
      year: data.year ? data.year : null,
      partyplot_ID: data.partyplot_ID ? data.partyplot_ID : null,
    }

    this.adminLayoutService.getInquiryListForCalenderView(inquiryObj).subscribe((response: any) => {

      if (response.meta.code == 200) {
        this.inquiryEvent = [];
        this.inquiryEvent = response.data;
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
        // eventClick: this.eventClickFunction.bind(this),
        contentHeight:"auto",
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
      // events: this.inquiryEvent,
      // eventClick: this.eventClickFunction.bind(this),
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
  isBookedOrNotForListView = {}


  searchFilterInquiryList() {
    this.currentYear = this.searchedYear;
    this.currentMonth = this.searchedMonth;
    if (this.searchedMonth != null && this.searchedYear == null) {
      this.invaildSearchList = true;
      return
    } else {
      this.invaildSearchList = false;
    }
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
        this.searchedPartyplot = Response.data[0]._id ? Response.data[0]._id : null;

        const url = this.router.url;
        if (url.includes('inquiry/list-view')) {
          this.isInquiryTab = true;
          this.searchedMonth = this.currentMonth;
          this.searchedYear = this.currentYear;
          // this.getInquiryList({ month: parseInt(this.searchedMonth), year: this.searchedYear, name: this.searchedName, partyplot_ID: this.searchedPartyplot })
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
      // eventType: [, [Validators.required]],
      // guest: ["", [Validators.required]],
      startDateObj: ["", [Validators.required]],
      // endDateObj: ["", [Validators.required]],
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
    // this.inquiryForm.controls.eventType.setValue(data.eventType == '' ? null : data.eventType)
    // this.inquiryForm.controls.guest.setValue(data.guest)
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
        // this.getInquiryList({ month: this.searchedMonth, year: this.searchedYear, name: this.searchedName, partyplot_ID: this.searchedPartyplot })
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
  addStaff() {
    $('#cricket-slotbook-by-date-modal').modal('show');
  }
  slotBook(){
    $('#cricket-slotbook-by-date-modal').modal('hide');
    $('#add-cricket-details-modal').modal('show');
  }

}
