import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { AdminLayoutService } from 'app/layouts/admin-layout/admin-layout.service';
import { FrontLayoutService } from 'app/layouts/front-layout/front-layout.service';
import { CommonService } from 'app/shared/common.service';
import * as moment from "moment";
declare const $: any;
export const MY_FORMATS = {
  parse: {
    dateInput: "LL",
  },
  display: {
    dateInput: "DD-MM-YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY",
  },
};
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  partyplotListforcricket: any[] = [];
  searchedPartyplot = null;
  date = new Date();
  currentMonth = (this.date.getMonth() + 1).toString();
  currentYear = this.date.getFullYear();
  cricketBookingListforCalendar: any[] = [];
  slotListByDate: any[] = [];
  slot: any[] = [];
  slotTime: any[] = [];
  slotDate: string;
  slotData = [];
  bookingData: any = {};
  isFullDaySlot : boolean = false;
  isFullDayShow : boolean = false;
  constructor(private frontLayoutService: FrontLayoutService,
    private commonService: CommonService,) { 
      this.getPartyplotListforcricket();
    }

  ngOnInit(): void {
  }
  getPartyplotListforcricket() {
    this.frontLayoutService.getpartyplotListforcricket().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.partyplotListforcricket = Response.data;

          this.searchedPartyplot = Response.data[0]._id;
          this.getInquiryListForCalenderView({
            month: this.currentMonth,
            year: this.currentYear,
            partyplotId: this.searchedPartyplot,
          });
        }
        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  
    // calender view
    @ViewChild("calendar") calendarComponent: FullCalendarComponent;

    calendarOptions: CalendarOptions;
  
    partyplotChange() {
      this.getInquiryListForCalenderView({
        month: this.currentMonth,
        year: this.currentYear,
        partyplotId: this.searchedPartyplot,
      });
    }
  
    // calender view list data
    getInquiryListForCalenderView(data: any) {
      let obj = {
        month: data.month ? data.month : null,
        year: data.year ? data.year : null,
        partyplotId: data.partyplotId ? data.partyplotId : null,
      };
  
      this.frontLayoutService
        .getCricketbookinglistmonthwise(obj)
        .subscribe((response: any) => {
          this.cricketBookingListforCalendar = [];
          if (response.meta.code == 200) {
          this.cricketBookingListforCalendar = response.data;
          }
          this.calendarOptions = {
            initialView: 'dayGridMonth',
            headerToolbar: {
              left: 'prev,next title',
              center: '',
              right: ''
            },
            showNonCurrentDates: false,
            initialDate: new Date(this.currentYear + '-' + this.currentMonth),
            businessHours: false, // display business hours
            dateClick: this.handleDateClick.bind(this),
            events: this.cricketBookingListforCalendar,
            expandRows: true,
            eventClick: this.handleDateClick.bind(this),
            contentHeight: "auto",
            customButtons: {
              next: {
                click: this.nextMonth.bind(this)
              },
              prev: {
                click: this.prevMonth.bind(this)
              }
            },
          }
          
        });
  
        this.calendarOptions = {
          initialView: 'dayGridMonth',
          headerToolbar: {
            left: 'prev,next title',
            center: '',
            right: ''
          },
          showNonCurrentDates: false,
          initialDate: new Date(this.currentYear + '-' + this.currentMonth),
          businessHours: false, // display business hours
          dateClick: this.handleDateClick.bind(this),
          events: this.cricketBookingListforCalendar,
          expandRows: true,
          eventClick: this.handleDateClick.bind(this),
          contentHeight: "auto",
          customButtons: {
            next: {
              click: this.nextMonth.bind(this)
            },
            prev: {
              click: this.prevMonth.bind(this)
            }
          },
        }
  
    }

      // date selction through open popup
  handleDateClick(arg) {
    this.slotListByDate = [];
    this.bookingData = {};
    this.slot = [];
    this.isFullDaySlot = false;
    this.slotDate = arg.date;
    let obj = {
      date: moment(arg.date).format("DD/MM/yyyy"),
      partyplotId: this.searchedPartyplot,
    };

    this.frontLayoutService
      .slotListByDatewise(obj)
      .subscribe((Response: any) => {
        if(Response.meta.code == 200) {
          this.slotListByDate = Response.data;
          for (let index = 0; index < this.slotListByDate.length; index++) {
            this.slotData.push(false)
          }
          let bookedSlotList = [];
          bookedSlotList = this.slotListByDate.filter((x:any) => x.isbooked == 1)
          if(bookedSlotList?.length > 0) {
            this.isFullDayShow = false
          } else {
            this.isFullDayShow = true
          }
          $("#cricket-slotbook-by-date-modal").modal("show");
        } else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      });
  }
      // For Next Month Click
  nextMonth(): void {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
    let month = calendarApi.currentData.currentDate.toJSON();

    this.currentMonth = month.split("T")[0].split("-")[1];
    this.currentYear = calendarApi.currentData.currentDate.getFullYear();
    this.getInquiryListForCalenderView({ month: this.currentMonth, year: this.currentYear, partyplotId: this.searchedPartyplot });
  }

  // For Prev Month Click
  prevMonth(): void {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.prev();

    let month = calendarApi.currentData.currentDate.toJSON();
    this.currentMonth = month.split("T")[0].split("-")[1];
    this.currentYear = calendarApi.currentData.currentDate.getFullYear();
    this.getInquiryListForCalenderView({ month: this.currentMonth, year: this.currentYear, partyplotId: this.searchedPartyplot });
  }
  closeBookSlot() {
    $("#cricket-slotbook-by-date-modal").modal("show");
  }
  slotBook() {
    $("#cricket-slotbook-by-date-modal").modal("hide");
    $("#add-cricket-details-modal").modal("show");
  }

}
