import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminLayoutService } from 'app/layouts/admin-layout/admin-layout.service';
import { CommonService } from 'app/shared/common.service';

@Component({
  selector: 'app-booking-confirm-list',
  templateUrl: './booking-confirm-list.component.html',
  styleUrls: ['./booking-confirm-list.component.css']
})
export class BookingConfirmListComponent implements OnInit {

  bookingconfirmList: any[] | any;
  allbookingconfirmList: any[] | any;
  bookingConfirmList: any[] | any;
  bookingconfirmListlength: any;
  noData;
  l: number;
  p: number = 1;
  assignpartyplotList: any[] = [];
  searchedPartyplot = null;

  constructor(public adminLayoutService: AdminLayoutService,
    private fb: FormBuilder,
    public commonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.l = 10;
    this.getAssignPartyplotList();

  }

  getAssignPartyplotList() {
    this.adminLayoutService.assignpartyplotUserWiseList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.assignpartyplotList = Response.data;
        this.searchedPartyplot = Response.data[0]._id ? Response.data[0]._id : null;
        this.partyplotChange();
      }
    },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  partyplotChange() {
    let Obj = {
      partyplot_ID: this.searchedPartyplot
    }
    this.adminLayoutService.getBookingConfirmListDetails(Obj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.bookingConfirmList = Response.data.inquirybookingData.filter((x: any) => x.approvestatus == 2);
          this.bookingconfirmList = this.bookingConfirmList;
          this.allbookingconfirmList = this.bookingconfirmList;
          this.bookingconfirmList = this.bookingConfirmList.slice();
          this.bookingconfirmListlength = Response.data.length;
          this.noData = false;
        } else {
          this.noData = true;
        }
        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  search(value: string): void {
    this.bookingConfirmList = this.allbookingconfirmList.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.bookingConfirmList.length == 0) {

      this.noData = true;
    } else {
      this.noData = false;
    }
  }

  viewBookingConfirm(params: any) {
    this.router.navigate(['/admin/view-booking-confirm/' + params.id])
  }

  cancelBookingConfirm(params: any) {
    let Obj = {
      _id: params.id,
      approvestatus: 3
    }
    this.adminLayoutService.cancleBookingConfirmInquiry(Obj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.partyplotChange();
          this.commonService.notifier.notify('success', Response.meta.message)
        }
      }
    )
  }

}
