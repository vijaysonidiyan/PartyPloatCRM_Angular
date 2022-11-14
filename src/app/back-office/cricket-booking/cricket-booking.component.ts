import { Component, OnInit, ViewChild } from "@angular/core";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CalendarOptions, FullCalendarComponent } from "@fullcalendar/angular";
import { CommonService } from "app/shared/common.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  ThemePalette,
} from "@angular/material/core";
import * as moment from "moment";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
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
  selector: "app-cricket-booking",
  templateUrl: "./cricket-booking.component.html",
  styleUrls: ["./cricket-booking.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CricketBookingComponent implements OnInit {
  activeTab = 2;
  l: number;
  p: number = 1;
  searchedPartyplot = null;
  date = new Date();
  currentMonth = (this.date.getMonth() + 1).toString();
  currentYear = this.date.getFullYear();
  cricketBookingForm: FormGroup;
  partyplotListforcricket: any[] = [];
  noData: boolean;
  startDateObj = "";
  endDateObj: any;
  gotoDate: any;
  isSlotBooked: boolean = false;
  bookingDataFlag: boolean = false;
  submittedCricketData = false;
  selectedPartyplot: any;
  slotListByDate: any[] = [];
  slot: any[] = [];
  slotTime: any[] = [];
  slotDate: string;
  slotData = [];
  bookingData: any = {};
  cricketBookingListforCalendar: any[] = [];
  isFullDaySlot : boolean = false;
  isFullDayShow : boolean = false;

  constructor(
    private adminLayoutService: AdminLayoutService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.getAssignPartyplotList();
  }

  ngOnInit(): void {
    this.l = 10;
    this.defaultForm();
    this.getYear();
  }

  defaultForm() {
    this.cricketBookingForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", Validators.required],
      primaryContact: ["", Validators.required],
      secondaryContact: [""],
      address: [""],
      partyplotId: [null, Validators.required],
      date: [""],
    });
  }

  savecricketData() {
    
    if (this.cricketBookingForm.invalid) {
      this.submittedCricketData = true;
      return;
    }
    let date = moment(this.slotDate).format("yyyy-MM-DD");
    let time = "00:00";
    let newSlotDate =
      moment(new Date(date + " " + time)).format("yyyy-MM-DDTHH:mm:ss") +
      ".000+00:00";

    let cricketModelObj = {
      name: this.cricketBookingForm.controls.name.value,
      email: this.cricketBookingForm.controls.email.value,
      primaryContact: this.cricketBookingForm.controls.primaryContact.value,
      secondaryContact: this.cricketBookingForm.controls.secondaryContact.value,
      address: this.cricketBookingForm.controls.address.value,
      partyplotId: this.cricketBookingForm.controls.partyplotId.value,
      slot: this.slot,
      date: newSlotDate,
    };
    // return;
    this.adminLayoutService.savecricketBookingData(cricketModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedCricketData = false;
          this.slotData = [];
          this.isCheck = {};
          this.slot = [];
          this.slotTime = [];
          this.isSlotBooked = false;
          this.defaultForm();
          $("#add-cricket-details-modal").modal("hide");
          $("#cricket-slotbook-by-date-modal").modal("show");
          this.commonService.notifier.notify(
            "success",
            "Booking Details Saved Successfully."
          );

          this.handleDateClick({ date: this.slotDate });
        } else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAssignPartyplotList() {
    this.adminLayoutService.getpartyplotListforcricket().subscribe(
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

    this.adminLayoutService
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
      });

      this.calendarOptions = {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next title',
          center: '',
          right: ''
        },
        showNonCurrentDates: false,
        businessHours: false, // display business hours
        dateClick: this.handleDateClick.bind(this),
        events: this.cricketBookingListforCalendar,
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

    // let calendarApi = this.calendarComponent.getApi();
    // calendarApi.gotoDate(new Date(this.currentMonth + '-01-' + this.currentYear));
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

    this.adminLayoutService
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

  isCheck = {};

  dayTypeEvent(checked) {

    if(checked.checked == true) {
      this.slotListByDate.forEach((slotListByDateData: any,index:number) => {
        //this.getSlotIdOnChecked(slotListByDateData._id,true,index,slotListByDateData.time,slotListByDateData.isbooked,slotListByDateData.cricket_bookingData[0])
        this.slotData[index] = true;
        this.isCheck[index] = 5;
        this.slot.push(slotListByDateData._id);
        this.slotTime.push(slotListByDateData.time);
      })
    } else {
      this.slotData = [];
      this.isCheck = {};
      this.slot = []
      this.slotTime = []
      this.isSlotBooked = false;
    }
  }

  getSlotIdOnChecked(
    slotId: any,
    index: any,
    slotTime: any,
    isBooked: any,
    bookingData: any
  ) {
    debugger
    this.bookingData = {}
    this.slotData[index] = !this.slotData[index]
    if (isBooked == 1) {
      if (this.slotData[index] === true) {
        this.bookingDataFlag = true;
      }
      else {
        this.bookingDataFlag = false;
      }
      this.bookingData = bookingData;
    } else if (isBooked == 0) {
      if (this.slotData[index] == true) {
        this.isCheck[index] = 5;
        this.slot.push(slotId);
        this.slotTime.push(slotTime);
      } else {
        this.isCheck[index] = 0;
        let getindex = this.slot.indexOf(slotId);
        let getTimeindex = this.slotTime.indexOf(slotTime);
        this.slot.splice(getindex, 1);
        this.slotTime.splice(getTimeindex, 1);
      }
      if (this.slot.length > 0) {
        this.isSlotBooked = true;
      } else {
        this.isSlotBooked = false;
      }
    }
    let abc = this.slotData.filter((x:any) => x == false)
    if(abc?.length > 0) {
      this.isFullDaySlot = false;
    } else {
      this.isFullDaySlot = true;
    }
  }

  // get month and year wise api call and get data

  yearArray = new Array<number>();
  monthArray = [
    { value: "1", month: "January" },
    { value: "2", month: "February" },
    { value: "3", month: "March" },
    { value: "4", month: "April" },
    { value: "5", month: "May" },
    { value: "6", month: "June" },
    { value: "7", month: "July" },
    { value: "8", month: "August" },
    { value: "9", month: "September" },
    { value: "10", month: "October" },
    { value: "11", month: "November" },
    { value: "12", month: "December" },
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
        this.yearArray.push(arr);
      }
    }
    return this.yearArray;
  }

  // update inquiry
  submittedcricketBookingData: boolean = false;
  get fcricketBookingData() {
    return this.cricketBookingForm.controls;
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
  public color: ThemePalette = "primary";




  addcricketDetails() {
    $("#cricket-slotbook-by-date-modal").modal("show");
  }
  closeBookDetails() {
    this.defaultForm();
    //this.slotData = [];
    this.bookingData = {}
    this.bookingDataFlag = false;
    $("#cricket-slotbook-by-date-modal").modal("show");
  }
  closeBookSlot() {
    this.defaultForm();
    this.slotData = [];
    this.isCheck = {};
    this.slotTime = [];
    this.slot = [];
    this.bookingData = {}
    this.isSlotBooked = false;
    this.bookingDataFlag = false;
    $("#cricket-slotbook-by-date-modal").modal("show");
  }
  slotBook() {
    this.isSlotBooked = true;
    $("#cricket-slotbook-by-date-modal").modal("hide");
    $("#add-cricket-details-modal").modal("show");
    this.cricketBookingForm.controls.partyplotId.setValue(
      this.searchedPartyplot
    );
    this.cricketBookingForm.controls.date.setValue(this.slotDate);
  }
}
