import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { AdminLayoutService } from 'app/layouts/admin-layout/admin-layout.service';
import { CommonService } from 'app/shared/common.service';
import * as Chartist from 'chartist';
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activepartyplotList: any[] = [];
  searchedPartyplot = null;
  date = new Date();
  searchedMonth = (this.date.getMonth() + 1).toString();
  searchedYear = this.date.getFullYear();
 calendarOptions: CalendarOptions;

// calender view
@ViewChild('calendar') calendarComponent: FullCalendarComponent;
inquiryEvent = [];
eventActiveList: any[] = [];


  constructor(private adminLayoutService: AdminLayoutService, private commonService: CommonService, private fb: FormBuilder, private router: Router) {
    this.getActivePartyplotList();
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
  
  getActivePartyplotList() {
    this.adminLayoutService.getPartyplotActiveList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.activepartyplotList = Response.data;
        this.searchedPartyplot = Response.data[0]._id ? Response.data[0]._id : null;
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
        events: this.inquiryEvent,
        expandRows: true,
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
}
