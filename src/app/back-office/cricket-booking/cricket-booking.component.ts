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

  isSlotBooked: boolean = false;
  bookingDataFlag: boolean = false;
  //submittedCricketData = false;
  selectedPartyplot: any;
  slotListByDate: any[] = [];
  slot: any[] = [];
  slotTime: any[] = [];
  slotDate: string;
  slotData = [];
  bookingData: any = {};
  cricketBookingListforCalendar: any[] = [];
  isFullDaySlot: boolean = false;
  isFullDayShow: boolean = false;
  isFullDayBooked: boolean = false;

  isCheck = [];
  yearArray = new Array<number>();
  submittedcricketBookingData: boolean = false;
  isPastDate: boolean = false;
  slotDisable = {};
  invalidSlotTime = [];
  get fcricketBookingData() {
    return this.cricketBookingForm.controls;
  }

  constructor(
    private adminLayoutService: AdminLayoutService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.getPartyplotListforcricket();
  }

  ngOnInit(): void {
    this.l = 10;
    this.defaultForm();

  }

  defaultForm() {
    this.cricketBookingForm = this.fb.group({
      name: ["", Validators.required],
      email: [""],
      primaryContact: ["", Validators.required],
      secondaryContact: [""],
      address: [""],
      remark: [""],
      partyplotId: [null, Validators.required],
      date: [""],
    });
  }

  // get month and year wise api call and get data

  getPartyplotListforcricket() {
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

  savecricketData() {

    if (this.cricketBookingForm.invalid) {
      this.submittedcricketBookingData = true;
      return;
    }
    let date = moment(this.slotDate).format("yyyy-MM-DD");
    let time = "00:00";
    let newSlotDate =
      moment(new Date(date + " " + time)).format("yyyy-MM-DDTHH:mm:ss") +
      ".000Z";

    let cricketModelObj = {
      name: this.cricketBookingForm.controls.name.value,
      email: this.cricketBookingForm.controls.email.value,
      primaryContact: this.cricketBookingForm.controls.primaryContact.value,
      secondaryContact: this.cricketBookingForm.controls.secondaryContact.value,
      address: this.cricketBookingForm.controls.address.value,
      remark: this.cricketBookingForm.controls.remark.value,
      partyplotId: this.cricketBookingForm.controls.partyplotId.value,
      slot: this.slot,
      date: newSlotDate,
      isFullDay: false,
    };
    // return;
    this.adminLayoutService.savecricketBookingData(cricketModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedcricketBookingData = false;
          this.slotData = [];
          this.isCheck = [];
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
          this.getInquiryListForCalenderView({
            month: this.currentMonth,
            year: this.currentYear,
            partyplotId: this.searchedPartyplot,
          });
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
  cancelcricketBookingConfirm(id: any) {
    let Obj = {
      _id: id,
      "iscancle": true
    }
    this.adminLayoutService.cancleCricketBookingConfirm(Obj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.bookingDataFlag = false;
          this.handleDateClick({ date: this.slotDate });
          this.getInquiryListForCalenderView({
            month: this.currentMonth,
            year: this.currentYear,
            partyplotId: this.searchedPartyplot,
          });
          this.commonService.notifier.notify('success', Response.meta.message)
        }
        else {
          this.commonService.notifier.notify('error', Response.meta.message)
        }
      }
    )
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
          // eventClick: this.handleDateClick.bind(this),
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
      // eventClick: this.handleDateClick.bind(this),
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
    this.isFullDayBooked = false
    this.slotDate = arg.date;
    let obj = {
      date: moment(arg.date).format("DD/MM/yyyy"),
      partyplotId: this.searchedPartyplot,
    };

    this.adminLayoutService
      .slotListByDatewise(obj)
      .subscribe((Response: any) => {
        if (Response.meta.code == 200) {
          // this.isFullDaySlot = Response.data.isFullDay
          // if (Response.data.isFullDay === false) {
          this.slotListByDate = Response.data.slotData.sort((a, b) => a.order - b.order);
          // this.isFullDayBooked = false
          // } else {
          //   this.bookingDataFlag = true
          //   this.isFullDayBooked = true

          //   let data = Response.data.slotData.filter((x: any) => x.isFullDay == true)
          //   this.bookingData = {
          //     _id: data[0]._id,
          //     name: data[0].name,
          //     email: data[0].email,
          //     primaryContact: data[0].primaryContact,
          //     secondaryContact: data[0].secondaryContact,
          //     time: data[0].time,
          //     address: data[0].address,
          //     remark: data[0].remark,
          //   }
          //   //this.slotListByDate = Response.data.slotData
          // }
          this.slotListByDate.forEach((x: any, i: number) => {
            this.isCheck[i] = false
          })
          let todayDate = moment(new Date()).format('yyyy-MM-DD');
          let argDate = moment(arg.date).format('yyyy-MM-DD');

          if (argDate < todayDate) {
            this.isPastDate = true;
            this.isFullDayShow = false;
          } else {
            this.isPastDate = false;
            let bookedSlotList = [];
            bookedSlotList = this.slotListByDate.filter((x: any) => x.isbooked == 1)
            if (bookedSlotList?.length > 0) {
              this.isFullDayShow = false
            } else {
              this.isFullDayShow = true
            }
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



  dayTypeEvent(checked) {

    this.slotListByDate.forEach((x: any, i: number) => {
      this.isCheck[i] = false
    })
    if (checked.checked == true) {
      this.slotTime = [];
      this.slot = [];
      this.slotListByDate.forEach((slotListByDateData: any, index: number) => {
        ////this.getSlotIdOnChecked(slotListByDateData._id,true,index,slotListByDateData.time,slotListByDateData.isbooked,slotListByDateData.cricket_bookingData[0])
        //this.slotData[index] = true;
        //this.isCheck[index] = 5;
        this.slotDisable[index] = true
      })
      this.slot.push('63bbaa5d5491d6aca0a2c2b4');
      this.slotTime.push('7:00 AM to 07:00 PM');
      this.isSlotBooked = true;
    } else {
      this.slotListByDate.forEach((slotListByDateData: any, index: number) => {

        this.slotDisable[index] = false
      })
      this.slot = []
      this.slotTime = []
      this.isSlotBooked = false;
    }
  }

  getSlotIdOnChecked({ slotData: slotData, index: index }) {

    this.bookingData = {}
    this.bookingDataFlag = false
    if (slotData.isbooked == 0) {
      if (this.isPastDate == false) {

        if (this.isCheck[index] == false) {

          let date = moment(this.slotDate).format('yyyy-MM-DD')
          let startDate = new Date(date + ' ' + slotData.startTime)
          let endDate = new Date(date + ' ' + slotData.endTime)
          let invalidCount = 0
          this.isCheck.forEach((x: any, i: number) => {
            if (x == true) {
              let data = this.slotListByDate[i]
              let xStartDate = new Date(date + ' ' + data.startTime)
              let xEndDate = new Date(date + ' ' + data.endTime)
              if (data._id != slotData._id && (((startDate < xStartDate) && (xStartDate < endDate)) || ((endDate > xEndDate) && xEndDate > startDate) || (xStartDate < startDate) && (startDate < xEndDate)) || ((xEndDate > endDate) && endDate > xStartDate)) {
                this.invalidSlotTime[index] = true
                this.commonService.notifier.notify("error", 'This Slot is not Available.')
                invalidCount++
              }
            }
          })
          this.slotListByDate.filter((y: any, j: number) => {
            if (y.isbooked == 1) {
              let xStartDate = new Date(date + ' ' + y.startTime)
              let xEndDate = new Date(date + ' ' + y.endTime)
              if (y._id != slotData._id && (((startDate < xStartDate) && (xStartDate < endDate)) || ((endDate > xEndDate) && xEndDate > startDate) || (xStartDate < startDate) && (startDate < xEndDate)) || ((xEndDate > endDate) && endDate > xStartDate)) {
                this.invalidSlotTime[index] = true
                this.commonService.notifier.notify("error", 'This Slot is not Available.')
                invalidCount++
              }
            }
          })
          if (invalidCount == 0) {
            this.isCheck[index] = true
            this.slot.push(slotData._id);
            this.slotTime.push(slotData.time);
          }

        } else if (this.isCheck[index] == true) {
          this.isCheck[index] = false
          this.invalidSlotTime[index] = false
          let getindex = this.slot.indexOf(slotData._id);
          let getTimeindex = this.slotTime.indexOf(slotData.time);
          this.slot.splice(getindex, 1);
          this.slotTime.splice(getTimeindex, 1);
        }


        if (this.slot.length > 0) {
          this.isSlotBooked = true;
        } else {
          this.isSlotBooked = false;
        }




      }
    } else if (slotData.isbooked == 1) {
      this.bookingDataFlag = true;
      this.bookingData = slotData.cricket_bookingData[0];
      this.bookingData.time = slotData.time
    }
  }



  // update inquiry

  // // calender
  // // public date: moment.Moment;
  // public disabled = false;
  // public showSpinners = true;
  // public showSeconds = false;
  // public touchUi = false;
  // public enableMeridian = false;
  // public minDate = new Date();
  // public minEndDate = {};
  // public maxDate: moment.Moment;
  // public stepHour = 1;
  // public stepMinute = 1;
  // public stepSecond = 1;
  // public color: ThemePalette = "primary";




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
    this.isCheck = [];
    this.slotTime = [];
    this.slot = [];
    this.bookingData = {}
    this.isSlotBooked = false;
    this.bookingDataFlag = false;
    this.slotDisable = {}
    $("#cricket-slotbook-by-date-modal").modal("hide");
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
