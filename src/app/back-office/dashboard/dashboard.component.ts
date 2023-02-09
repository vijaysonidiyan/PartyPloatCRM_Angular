import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { AdminLayoutService } from 'app/layouts/admin-layout/admin-layout.service';
import { CommonService } from 'app/shared/common.service';
import * as Chartist from 'chartist';
import { Router } from "@angular/router";
import { FrontLayoutService } from 'app/layouts/front-layout/front-layout.service';
import * as moment from 'moment';
declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activepartyplotList: any[] = [];
  cricketBookingListforCalendar: any[] = [];
  searchedPartyplot = null;
  searchedPartyplotForCricketBooking = null;
  date = new Date();
  searchedMonth = (this.date.getMonth() + 1).toString();
  searchedYear = this.date.getFullYear();
  calendarOptions: CalendarOptions;
  calendarOptionsForCricketBooking: CalendarOptions;

  // calender view
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('calendarCricket') calendarComponentForCricket: FullCalendarComponent;
  inquiryEvent = [];
  eventActiveList: any[] = [];
  partyplotListforcricket: any[] = [];
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;

  constructor(private adminLayoutService: AdminLayoutService, private frontLayoutService: FrontLayoutService, private commonService: CommonService, private fb: FormBuilder, private router: Router) {
    // let pagePermission = { module: "dashboard" }
    // this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {
    //   
    //   if (Response.meta.code == 200) {

    //     this.isView = Response.data.isView;
    //     this.isCreated = Response.data.isCreated;
    //     this.isUpdated = Response.data.isUpdated;
    //     this.isDeleted = Response.data.isDeleted;
    //     if (this.isView === false) {
    //       this.router.navigate(['admin/dashboard']);
    //     }
    //   }
    // }, (error) => {
    //   console.log(error.error.Message);
    // });
    this.getActivePartyplotList();
    this.getPartyplotListforcricket();
  }

  ngOnInit() {
    this.getEventActiveList();
  }

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

  partyplotChange() {
    this.getInquiryListForCalenderView({ month: this.searchedMonth, year: this.searchedYear, partyplot_ID: this.searchedPartyplot })
  }

  getPartyplotListforcricket() {
    this.frontLayoutService.getpartyplotListforcricket().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.partyplotListforcricket = Response.data;

          this.searchedPartyplotForCricketBooking = Response.data[0]._id;
          this.getCricketBookingList({
            month: this.searchedMonth,
            year: this.searchedYear,
            partyplot_ID: this.searchedPartyplotForCricketBooking,
          });
        }
        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  getActivePartyplotList() {
    this.adminLayoutService.getPartyplotActiveList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.activepartyplotList = Response.data;
        let partyPlotId = localStorage.getItem("partyPlotId")
        if (!!partyPlotId && partyPlotId != null && partyPlotId != "" && partyPlotId != "null") {
          let data = this.activepartyplotList.filter((x: any) => x._id == partyPlotId)
          if (data) {
            this.searchedPartyplot = partyPlotId;
            this.searchedPartyplotForCricketBooking = partyPlotId;
          } else {
            this.searchedPartyplot = Response.data[0]._id ? Response.data[0]._id : null;
            this.searchedPartyplotForCricketBooking = Response.data[0]._id ? Response.data[0]._id : null;
          }
        } else {
          this.searchedPartyplot = Response.data[0]._id ? Response.data[0]._id : null;
          this.searchedPartyplotForCricketBooking = Response.data[0]._id ? Response.data[0]._id : null;
        }
        this.getInquiryListForCalenderView({ month: this.searchedMonth, year: this.searchedYear, partyplot_ID: this.searchedPartyplot })

      }
      //for select sub industry step
    },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  // calender view list data
  getInquiryListForCalenderView(data: any) {


    let inquiryObj = {
      month: data.month ? data.month : null,
      year: data.year ? data.year : null,
      partyplot_ID: data.partyplot_ID ? data.partyplot_ID : null,
    }

    this.adminLayoutService.getInquiryListForCalenderViewForDashboard(inquiryObj).subscribe((response: any) => {

      if (response.meta.code == 200) {
        this.inquiryEvent = [];
        this.inquiryEvent = response.data.list;
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
        events: this.inquiryEvent,
        expandRows: true,
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
      events: this.inquiryEvent,
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
  // For Next Month Click
  nextMonth(): void {

    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
    let month = calendarApi.currentData.currentDate.toJSON();

    this.searchedMonth = month.split('T')[0].split('-')[1];
    this.searchedYear = calendarApi.currentData.currentDate.getFullYear();
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
    this.getInquiryListForCalenderView({ month: this.searchedMonth, year: this.searchedYear, partyplot_ID: this.searchedPartyplot });
    // console.log(calendarApi)
  }



  // cricket booking data list
  partyplotChangeForCricketBooking() {
    this.getCricketBookingList({
      month: this.searchedMonth,
      year: this.searchedYear,
      partyplot_ID: this.searchedPartyplotForCricketBooking,
    });
  }

  // calender view list data
  getCricketBookingList(data: any) {
    let obj = {
      month: data.month ? data.month : null,
      year: data.year ? data.year : null,
      partyplotId: data.partyplot_ID ? data.partyplot_ID : null,
    };

    this.frontLayoutService.getCricketbookinglistmonthwise(obj).subscribe((response: any) => {

      this.cricketBookingListforCalendar = [];
      if (response.meta.code == 200) {
        this.cricketBookingListforCalendar = response.data;
      }
      this.calendarOptionsForCricketBooking = {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next title',
          center: '',
          right: ''
        },
        showNonCurrentDates: false,
        initialDate: new Date(this.searchedYear + '-' + this.searchedMonth),
        businessHours: false, // display business hours
        events: this.cricketBookingListforCalendar,
        expandRows: true,
        dateClick: this.handleDateClick.bind(this),
        contentHeight: "auto",
        customButtons: {
          next: {
            click: this.nextMonthForCricket.bind(this)
          },
          prev: {
            click: this.prevMonthForCricket.bind(this)
          }
        },
      }

    });

    this.calendarOptionsForCricketBooking = {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next title',
        center: '',
        right: ''
      },
      showNonCurrentDates: false,
      initialDate: new Date(this.searchedYear + '-' + this.searchedMonth),
      businessHours: false, // display business hours
      events: this.cricketBookingListforCalendar,
      expandRows: true,
      dateClick: this.handleDateClick.bind(this),
      contentHeight: "auto",
      customButtons: {
        next: {
          click: this.nextMonthForCricket.bind(this)
        },
        prev: {
          click: this.prevMonthForCricket.bind(this)
        }
      },
    }

  }

  // For Next Month Click
  nextMonthForCricket(): void {

    let calendarApi = this.calendarComponentForCricket.getApi();
    calendarApi.next();
    let month = calendarApi.currentData.currentDate.toJSON();

    this.searchedMonth = month.split('T')[0].split('-')[1];
    this.searchedYear = calendarApi.currentData.currentDate.getFullYear();
    this.getCricketBookingList({ month: this.searchedMonth, year: this.searchedYear, partyplot_ID: this.searchedPartyplotForCricketBooking });
    // console.log(calendarApi)
  }

  // For Prev Month Click
  prevMonthForCricket(): void {

    let calendarApi = this.calendarComponentForCricket.getApi();
    calendarApi.prev();

    let month = calendarApi.currentData.currentDate.toJSON();
    this.searchedMonth = month.split('T')[0].split('-')[1];
    this.searchedYear = calendarApi.currentData.currentDate.getFullYear();
    this.getCricketBookingList({ month: this.searchedMonth, year: this.searchedYear, partyplot_ID: this.searchedPartyplotForCricketBooking });
    // console.log(calendarApi)
  }

  slotListByDate: any[] = [];
  slotDate: string;
  isFullDaySlot: boolean = false;
  isDisabled = {}

  handleDateClick(arg) {

    this.slotListByDate = [];
    this.isFullDaySlot = false;
    this.slotDate = arg.date;
    let obj = {
      date: moment(arg.date).format("DD/MM/yyyy"),
      partyplotId: this.searchedPartyplotForCricketBooking,
    };

    this.frontLayoutService
      .slotListByDatewise(obj)
      .subscribe((Response: any) => {

        if (Response.meta.code == 200) {
          this.isFullDaySlot = Response.data.isFullDay
          if (Response.data.isFullDay === false) {
            let bookedData = Response.data.slotData.filter((x: any) => x.isbooked == 1)
            //console.log("bookedData", bookedData);

            Response.data.slotData.filter((x: any, i: number) => {
              if (x.isbooked == 1) {
                this.isDisabled[i] = false
              } else if (x.isbooked == 0) {

                let date = moment(this.slotDate).format('yyyy-MM-DD')
                let startDate = new Date(date + ' ' + x.startTime)
                let endDate = new Date(date + ' ' + x.endTime)
                let invalidCount = 0
                bookedData.filter((y: any, j: number) => {
                  if (y.isbooked == 1) {
                    let xStartDate = new Date(date + ' ' + y.startTime)
                    let xEndDate = new Date(date + ' ' + y.endTime)
                    if (y._id != x._id && (((startDate < xStartDate) && (xStartDate < endDate)) || ((endDate > xEndDate) && xEndDate > startDate) || (xStartDate < startDate) && (startDate < xEndDate)) || ((xEndDate > endDate) && endDate > xStartDate)) {
                      invalidCount++
                    }
                  }
                })

                if (invalidCount > 0) {
                  this.isDisabled[i] = true
                } else {
                  this.isDisabled[i] = false
                }
              }
            })
            this.slotListByDate = Response.data.slotData;

          } else {
            this.slotListByDate = []
            //this.slotListByDate = Response.data.slotData
          }

          $("#cricket-slotbook-by-date-modal").modal("show");
        } else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      });
  }


  closeBookSlot() {
    $("#cricket-slotbook-by-date-modal").modal("show");
  }
  slotBook() {
    $("#cricket-slotbook-by-date-modal").modal("hide");
    $("#add-cricket-details-modal").modal("show");
  }
}
