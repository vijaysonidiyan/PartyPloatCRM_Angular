import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminLayoutService } from 'app/layouts/admin-layout/admin-layout.service';
import { environment } from 'environments/environment';
declare const $: any;

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.css']
})
export class ViewBookingComponent implements OnInit {
  bookingConfirmId: any;
  bookingConfirmList: any;
  submittedUploadDecorationData: boolean = false;
  imageDecorationFile: any;
  fileImageDecoration: any;
  imageDecorationURLFile: any;
  decorationImageID = "";
  imageName = "";
  imageDescription = "";
  @ViewChild('imageDecoration') myInputVariableImageDecoration: ElementRef;
  imageDecorationList: any[] = [];
  imageDecorationError: boolean = false;
  decorationURLPath = environment.uploadedUrl;
  isEditDecorationImage: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private adminLayoutService: AdminLayoutService) {
    this.route.params.subscribe((x: Params) => {
      this.bookingConfirmId = x.id
    })
  }

  ngOnInit(): void {
    this.getClientDetailsByEventId()
  }

  getClientDetailsByEventId() {
    let eventIDObj = {
      _id: this.bookingConfirmId
    }
    this.adminLayoutService.getBookingConfirmListByBookingID(eventIDObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.bookingConfirmList = Response.data;
        this.getImageDecorationList()
      }
    })
  }

  cancleUploadImage() {
    $("#add-upload-decoration").modal("hide");
    this.imageDescription = "";
    this.imageName = "";
    this.imageDecorationFile = "";
    this.fileImageDecoration = "";
    this.imageDecorationURLFile = "";
    this.myInputVariableImageDecoration.nativeElement.value = "";
    this.submittedUploadDecorationData = false;
    this.imageDecorationError = false;
    this.isEditDecorationImage = false;
  }

  uploadDecorationModal() {
    this.imageDescription = "";
    this.imageName = "";
    this.imageDecorationFile = "";
    this.fileImageDecoration = "";
    this.imageDecorationURLFile = "";
    this.myInputVariableImageDecoration.nativeElement.value = "";
    this.submittedUploadDecorationData = false;
    this.imageDecorationError = false;
    $("#add-upload-decoration").modal("show");
  }

  onImageDecorationChange(event: any) {
    this.imageDecorationFile = event.target.files[0];
    if (!this.imageDecorationFile) {
      this.imageDecorationError = true;
    }
    else {
      this.imageDecorationError = false;
    }
    this.fileImageDecoration = this.imageDecorationFile.name;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageDecorationURLFile = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  removeImageDecorationFile() {
    this.imageDecorationFile = "";
    this.fileImageDecoration = "";
    this.imageDecorationURLFile = "";
    this.myInputVariableImageDecoration.nativeElement.value = "";
    this.imageDecorationError = true;
  }

  createImageDecoration() {

    if (!this.imageName || this.imageDecorationError === true) {
      this.submittedUploadDecorationData = true;
      this.imageDecorationError = true;
      return
    }

    let imageDecorationObj: FormData = new FormData();
    imageDecorationObj.append('name', this.imageName);
    imageDecorationObj.append('description', this.imageDescription);
    imageDecorationObj.append('inquiry_bookingID', this.bookingConfirmId);
    imageDecorationObj.append('Image', this.imageDecorationFile);

    this.adminLayoutService.imageDecorationCreate(imageDecorationObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.imageDescription = "";
        this.imageName = "";
        this.imageDecorationFile = "";
        this.fileImageDecoration = "";
        this.imageDecorationURLFile = "";
        this.isEditDecorationImage = false;
        this.submittedUploadDecorationData = false;
        this.imageDecorationError = false;
        this.myInputVariableImageDecoration.nativeElement.value = "";
        this.getImageDecorationList();
        $("#add-upload-decoration").modal("hide");
      }
    })
  }
  updateImageDecoration() {

    if (!this.imageName || this.imageDecorationError === true) {
      this.submittedUploadDecorationData = true;
      this.imageDecorationError = true;
      return
    }

    let imageDecorationObj: FormData = new FormData();
    imageDecorationObj.append('_id', this.decorationImageID);
    imageDecorationObj.append('name', this.imageName);
    imageDecorationObj.append('description', this.imageDescription);
    imageDecorationObj.append('inquiry_bookingID', this.bookingConfirmId);
    imageDecorationObj.append('Image', this.imageDecorationFile);

    this.adminLayoutService.imageDecorationUpdate(imageDecorationObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.imageDescription = "";
        this.imageName = "";
        this.imageDecorationFile = "";
        this.fileImageDecoration = "";
        this.imageDecorationURLFile = "";
        this.isEditDecorationImage = false;
        this.submittedUploadDecorationData = false;
        this.imageDecorationError = false;
        this.myInputVariableImageDecoration.nativeElement.value = "";
        this.getImageDecorationList();
        $("#add-upload-decoration").modal("hide");
      }
    })

  }

  getImageDecorationList() {
    let BookingId = {
      inquirybookingID: this.bookingConfirmId
    }
    this.adminLayoutService.getImageDecorationListByBookingId(BookingId).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.imageDecorationList = Response.data[0].DecorationData;
      }
    })
  }

  editDecorationImages(params: any) {
    let Obj = {
      _id: params.id
    }
    this.adminLayoutService.getDecorationImagebyId(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.decorationImageID = Response.data._id;
        this.imageName = Response.data.name;
        this.imageDescription = Response.data.description;
        this.imageDecorationFile = Response.data.Image[0];
        this.imageDecorationURLFile = this.decorationURLPath + Response.data.Image[0];
        this.isEditDecorationImage = true
        $("#add-upload-decoration").modal("show");
      }
    })
  }



  deleteDecorationImages(params: any) {
    let Obj = {
      _id: params.id
    }
    this.adminLayoutService.deleteDecorationbyId(Obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.getImageDecorationList();
      }
    })
  }

}
