import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminLayoutService } from 'app/layouts/admin-layout/admin-layout.service';
import { CommonService } from 'app/shared/common.service';
import { environment } from 'environments/environment';
import { defaultFormat } from 'moment';
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
  submittedClientData: boolean = false;
  imageDecorationFile: any;
  fileImageDecoration: any;
  imageDecorationURLFile: any;
  decorationImageID = "";
  imageName = "";
  imageDescription = "";
  @ViewChild('imageDecoration') myInputVariableImageDecoration: ElementRef;
  assignpartyplotList: any[] = [];
  selectedPartyplot: any;
  eventListbyPartyplot: any;
  referenceActiveList: any[] = [];
  imageDecorationList: any[] = [];
  imageDecorationError: boolean = false;
  decorationURLPath = environment.uploadedUrl;
  isEditDecorationImage: boolean = false;
  viewBookingForm: FormGroup;
  clientdetailsDataForm: FormGroup;

  get fclientDataForm() {
    return this.clientdetailsDataForm.controls;
  }
  get fbookingConfirmData() {
    return this.viewBookingForm.controls;
  }
  eventList: any;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;

  constructor(private route: ActivatedRoute, private commonService: CommonService, private router: Router, private fb: FormBuilder, private adminLayoutService: AdminLayoutService) {
    let pagePermission = { module: "bookingConfirm" }
    this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {

      if (Response.meta.code == 200) {

        this.isView = Response.data.isView;
        this.isCreated = Response.data.isCreated;
        this.isUpdated = Response.data.isUpdated;
        this.isDeleted = Response.data.isDeleted;
        if (this.isView === false) {
          this.router.navigate(['admin/booking-confirm-list']);
        }
      }
    }, (error) => {
      console.log(error.error.Message);
    });
    this.route.params.subscribe((x: Params) => {
      this.bookingConfirmId = x.id
    })
  }

  ngOnInit(): void {
    this.defaultForm();
    this.eventList = this.viewBookingForm.get("extradecoration") as FormArray;
    this.getClientDetailsByEventId();
    this.defaultClientDetailsForm();
    this.getAssignPartyplotList();
    this.activeReferenceList();
  }

  defaultForm() {
    this.viewBookingForm = this.fb.group({
      name: [''],
      email: [''],
      primaryContact: [''],
      secondryContact: [''],
      address: [''],
      eventType: [''],
      guest: [''],
      startDateObj: [''],
      endDateObj: [''],
      reference_ID: [''],
      reference_detail: [''],
      partyplot_ID: [''],
      remark: [''],
      clientInquiryId: [''],
      client_budget: [''],
      partyPlotName: [''],
      eventName: [''],
      referenceName: [''],
      clientname: [''],
      offer_budget: [''],
      basicPackage: [''],
      discount: [''],
      finalbudget: [''],
      extraDecorBudget: ["0"],
      package: this.fb.array([]),
      extradecoration: this.fb.array([])
    })
  }
  defaultClientDetailsForm() {
    this.clientdetailsDataForm = this.fb.group({
      name: [''],
      email: [''],
      primaryContact: [''],
      secondryContact: [''],
      address: [''],
      eventType: [''],
      guest: [''],
      reference_ID: [''],
      reference_detail: [''],
      partyplot_ID: [''],
      remark: [''],
      client_budget: [''],
      offer_budget: [''],
    })
  }
  activeReferenceList() {
    this.adminLayoutService.getReferenceActiveList().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.referenceActiveList = Response.data
        }
      });
  }

  basicpackeageChanges() {
    if (this.viewBookingForm.value.discount) {
      let finalBudget = this.viewBookingForm.value.basicPackage - this.viewBookingForm.value.discount
      this.viewBookingForm.controls.finalbudget.setValue(finalBudget.toString());
    }
    else {
      let finalBudget = this.viewBookingForm.value.basicPackage
      this.viewBookingForm.controls.finalbudget.setValue(finalBudget.toString());
    }
  }
  discountChanges() {
    if (this.viewBookingForm.value.basicPackage && this.viewBookingForm.value.finalbudget) {
      let finalBudget = this.viewBookingForm.value.basicPackage - this.viewBookingForm.value.discount
      this.viewBookingForm.controls.finalbudget.setValue(finalBudget.toString());
    }
    else {
      let finalBudget = this.viewBookingForm.value.basicPackage
      this.viewBookingForm.controls.finalbudget.setValue(finalBudget.toString());
    }
  }
  finalBudgetChanges() {

    if (this.viewBookingForm.value.basicPackage && this.viewBookingForm.value.discount) {
      let discount = this.viewBookingForm.value.basicPackage - this.viewBookingForm.value.finalbudget
      this.viewBookingForm.controls.discount.setValue(discount.toString());
    }
    // else {
    //   let basicPackage = this.viewBookingForm.value.finalbudget
    //   this.viewBookingForm.controls.basicPackage.setValue(basicPackage.toString());
    // }
  }
  getEventList() {
    let obj = {
      _id: this.viewBookingForm.controls.partyplot_ID.value
    }
    this.adminLayoutService.geteventListbyPartyplot(obj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.eventListbyPartyplot = Response.data.eventsData;
        } else {
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
        if (!!this.selectedPartyplot) {
          this.clientdetailsDataForm.controls.partyplot_ID.setValue(this.selectedPartyplot);
        } else {
          this.clientdetailsDataForm.controls.partyplot_ID.setValue(Response.data[0]._id);
        }
        //this.getEventList();

      }
      //for select sub industry step
    },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }

  addPackageItem(oItem?: any) {
    let packageList: any;
    packageList = this.viewBookingForm.get("package") as FormArray;
    let IG = this.fb.group({
      categoryName: [(oItem ? oItem['categoryName'] : ''),],
      packageCategoryList: this.fb.array([]),
    });

    packageList.push(IG);

    let menuIndex = packageList.length - 1;
    if (!oItem) {
      this.createCategoryItem(menuIndex);
    }
    else {
      oItem.packageCategoryList.forEach(cItem => {
        this.createCategoryItem(menuIndex, cItem);
      });
    }
  }
  createCategoryItem(oItem: number, cItem?: any) {
    let cd = this.fb.group({
      item: [(cItem ? cItem['item'] : ''), [Validators.required]],
      description: [(cItem ? cItem['description'] : '')],
      quantity: [(cItem ? cItem['quantity'] : ''), [Validators.required]],
    });
    (((this.viewBookingForm.controls['package'] as FormArray)
      .controls[oItem] as FormGroup).controls['packageCategoryList'] as FormArray).push(cd);
  }
  createExtraItem(oItem?: any): FormGroup {
    return this.fb.group({
      item: [oItem["item"] ? oItem["item"] : "", [Validators.required]],
      description: [oItem["description"] ? oItem["description"] : ""],
      quantity: [oItem["quantity"] ? oItem["quantity"] : ""],
      amount: [oItem["amount"] ? oItem["amount"] : "", [Validators.required]],
    });
  }

  calculateExdecorBudget() {
    let amount = 0;
    (this.viewBookingForm.controls['extradecoration'] as FormArray).controls.map((x: any, index: any) => {
      let newamount = x.value.amount ? parseInt(x.value.amount) : 0;
      amount = newamount + amount;
      this.viewBookingForm.controls.extraDecorBudget.setValue(amount.toString());
    });
  }

  getClientDetailsByEventId() {
    let eventIDObj = {
      _id: this.bookingConfirmId
    }
    this.adminLayoutService.getBookingConfirmListByBookingID(eventIDObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.bookingConfirmList = Response.data;
        this.viewBookingForm.controls.name.setValue(Response.data.name);
        this.viewBookingForm.controls.email.setValue(Response.data.email);
        this.viewBookingForm.controls.primaryContact.setValue(Response.data.primaryContact);
        this.viewBookingForm.controls.secondryContact.setValue(Response.data.secondryContact);
        this.viewBookingForm.controls.address.setValue(Response.data.address);
        this.viewBookingForm.controls.guest.setValue(Response.data.guest);
        this.viewBookingForm.controls.startDateObj.setValue(Response.data.startDateObj);
        this.viewBookingForm.controls.endDateObj.setValue(Response.data.endDateObj);
        this.viewBookingForm.controls.reference_ID.setValue(Response.data.reference_ID);
        this.viewBookingForm.controls.reference_detail.setValue(Response.data.reference_detail);
        this.viewBookingForm.controls.remark.setValue(Response.data.remark);
        this.viewBookingForm.controls.client_budget.setValue(Response.data.client_budget);
        this.viewBookingForm.controls.partyPlotName.setValue(Response.data.partyPlotName);
        this.viewBookingForm.controls.partyplot_ID.setValue(Response.data.partyplot_ID);
        this.viewBookingForm.controls.eventName.setValue(Response.data.eventName);
        this.viewBookingForm.controls.referenceName.setValue(Response.data.referenceName);
        this.viewBookingForm.controls.clientname.setValue(Response.data.clientname);
        this.viewBookingForm.controls.offer_budget.setValue(Response.data.offer_budget);
        this.viewBookingForm.controls.basicPackage.setValue(Response.data.basicPackage ? Response.data.basicPackage : Response.data.offer_budget);
        this.viewBookingForm.controls.discount.setValue(Response.data.discount ? Response.data.discount : "0");
        this.viewBookingForm.controls.finalbudget.setValue(Response.data.finalbudget ? Response.data.finalbudget : "0");
        this.viewBookingForm.controls.extraDecorBudget.setValue(Response.data.extraDecorBudget ? Response.data.extraDecorBudget : '0');
        Response.data.package.forEach((x: any) => {
          this.addPackageItem(x)
        })
        Response.data.extradecoration.forEach((x: any) => {
          this.eventList.push(this.createExtraItem(x))
        })

        this.getImageDecorationList();
        this.getEventList();
      }
    })
  }

  removeExtraDecoration(index: any) {
    this.submittedExtraItemData[index] = false
    this.eventList.removeAt(index)
  }
  clientDetailsUpdate() {
    let eventIDObj = {
      _id: this.bookingConfirmId
    }
    this.adminLayoutService.getBookingConfirmListByBookingID(eventIDObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        $("#add-client-details").modal("show");
        this.bookingConfirmList = Response.data;
        this.clientdetailsDataForm.controls.name.setValue(Response.data.name);
        this.clientdetailsDataForm.controls.email.setValue(Response.data.email);
        this.clientdetailsDataForm.controls.primaryContact.setValue(Response.data.primaryContact);
        this.clientdetailsDataForm.controls.secondryContact.setValue(Response.data.secondryContact);
        this.clientdetailsDataForm.controls.address.setValue(Response.data.address);
        this.clientdetailsDataForm.controls.guest.setValue(Response.data.guest);
        this.clientdetailsDataForm.controls.reference_ID.setValue(Response.data.reference_ID);
        this.clientdetailsDataForm.controls.reference_detail.setValue(Response.data.reference_detail);
        this.clientdetailsDataForm.controls.remark.setValue(Response.data.remark);
        this.clientdetailsDataForm.controls.client_budget.setValue(Response.data.client_budget);
        this.clientdetailsDataForm.controls.eventType.setValue(Response.data.eventType);
        this.clientdetailsDataForm.controls.partyplot_ID.setValue(Response.data.partyplot_ID);
        this.clientdetailsDataForm.controls.offer_budget.setValue(Response.data.offer_budget);
        //this.clientdetailsDataForm.controls.clientname.setValue(Response.data.clientname);
      }
    })

  }
  updateClientDetails() {

    if (this.clientdetailsDataForm.invalid) {
      this.submittedClientData = true;
      return;
    }
    let obj = {
      _id: this.bookingConfirmId,
      name: this.clientdetailsDataForm.value.name,
      email: this.clientdetailsDataForm.value.email,
      primaryContact: this.clientdetailsDataForm.value.primaryContact,
      secondryContact: this.clientdetailsDataForm.value.secondryContact,
      address: this.clientdetailsDataForm.value.address,
      guest: this.clientdetailsDataForm.value.guest,
      reference_ID: this.clientdetailsDataForm.value.reference_ID,
      reference_detail: this.clientdetailsDataForm.value.reference_detail,
      client_budget: this.clientdetailsDataForm.value.client_budget,
      eventType: this.clientdetailsDataForm.value.eventType,
      partyplot_ID: this.clientdetailsDataForm.value.SMTP,
      //clientname: this.clientdetailsDataForm.value.clientname,
      offer_budget: this.clientdetailsDataForm.value.offer_budget,
    };
    this.adminLayoutService.UpdateBookingConfirmClientDetails(obj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.defaultClientDetailsForm();
        this.getClientDetailsByEventId();
        $("#add-client-details").modal("hide");
      }
    });

  }
  cancleClientDetails() {
    $("#add-client-details").modal("hide");
    this.imageDescription = "";
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
    let mimeType = this.imageDecorationFile.type
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

    if (!this.imageName || !this.imageDecorationFile === true) {
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
        this.commonService.notifier.notify("success", "Decoration Image Uploaded Successfully.")
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
        this.commonService.notifier.notify("success", "Decoration Image Updated Successfully.")
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
        this.commonService.notifier.notify("success", "Decoration Image Deleted Successfully.")
      }
    })
  }


  // edit extra item form array start
  isEditExtraItem: boolean = false;
  submittedExtraItemData = {};
  addExtraItemArray() {
    this.eventList.push(this.createExtraItem({}));
  }
  editExtraItemFormArray() {
    this.isEditExtraItem = true;
    if (this.eventList.length == 0) {
      this.eventList.push(this.createExtraItem({}));
    }
  }
  cancleExtraItemIsEdit() {
    let eventIDObj = {
      _id: this.bookingConfirmId
    }
    this.adminLayoutService.getBookingConfirmListByBookingID(eventIDObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        this.eventList.clear()
        this.eventList = this.viewBookingForm.get("extradecoration") as FormArray;
        Response.data.extradecoration.forEach((x: any) => {
          this.eventList.push(this.createExtraItem(x))
        })
        this.viewBookingForm.controls.extraDecorBudget.setValue(Response.data.extraDecorBudget ? Response.data.extraDecorBudget : '0');
        this.isEditExtraItem = false;

        let validation = (this.viewBookingForm.controls['extradecoration'] as FormArray).controls;
        validation.map((x: any, index: any) => {
          x.controls.item.clearValidators();
          x.controls.quantity.clearValidators();
          x.controls.amount.clearValidators();
          this.submittedExtraItemData[index + 1] = false;
        })

      }
    })
  }
  updateExtraDecorationItem() {

    if (this.viewBookingForm.controls['extradecoration'].invalid) {
      (this.viewBookingForm.controls['extradecoration'] as FormArray).controls.map((x: any, index: any) => {
        this.submittedExtraItemData[index] = true
      });
      return
    }

    let updateExtraDecorationItemObj = {
      _id: this.bookingConfirmId,
      extradecoration: this.viewBookingForm.controls.extradecoration.value,
      extraDecorBudget: this.viewBookingForm.controls.extraDecorBudget.value
    }
    this.adminLayoutService.updateExtraItemDataList(updateExtraDecorationItemObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        let eventIDObj = {
          _id: this.bookingConfirmId
        }
        this.adminLayoutService.getBookingConfirmListByBookingID(eventIDObj).subscribe((Response: any) => {
          if (Response.meta.code == 200) {
            this.commonService.notifier.notify("success", "Extra Decoration Items Updated Successfully.")
            this.eventList.clear()
            this.eventList = this.viewBookingForm.get("extradecoration") as FormArray;
            Response.data.extradecoration.forEach((x: any) => {
              this.eventList.push(this.createExtraItem(x))
            })
            this.isEditExtraItem = false;
          }
        })
      }
    })
  }
  // edit extra item form array end

  // edit Package item form array start
  isEditPackageItem: boolean = false;

  editPackageItemFormArray() {
    this.isEditPackageItem = true;
  }
  canclePackageItemIsEdit() {
    let eventIDObj = {
      _id: this.bookingConfirmId
    }
    this.adminLayoutService.getBookingConfirmListByBookingID(eventIDObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        (this.viewBookingForm.get("package") as FormArray).clear()
        this.viewBookingForm.controls.basicPackage.setValue(Response.data.basicPackage);
        this.viewBookingForm.controls.discount.setValue(Response.data.discount);
        this.viewBookingForm.controls.finalbudget.setValue(Response.data.finalbudget);
        Response.data.package.forEach((x: any) => {
          this.addPackageItem(x)
        })
        this.isEditPackageItem = false;
      }
    })
  }
  updatePackageDecorationItem() {

    let updatePackageDecorationItemObj = {
      _id: this.bookingConfirmId,
      package: this.viewBookingForm.controls.package.value,
      basicPackage: this.viewBookingForm.controls.basicPackage.value,
      discount: this.viewBookingForm.controls.discount.value,
      finalbudget: this.viewBookingForm.controls.finalbudget.value
    }
    this.adminLayoutService.updatePackageItemDataList(updatePackageDecorationItemObj).subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        let eventIDObj = {
          _id: this.bookingConfirmId
        }
        this.adminLayoutService.getBookingConfirmListByBookingID(eventIDObj).subscribe((Response: any) => {
          if (Response.meta.code == 200) {
            this.commonService.notifier.notify("success", "Package Details Updated Successfully.");
            (this.viewBookingForm.get("package") as FormArray).clear()
            Response.data.package.forEach((x: any) => {
              this.addPackageItem(x)
            })
            this.isEditPackageItem = false;
          }
        })
      }
    })
  }
  // edit Package item form array end

  downloadPdf() {


    let downloadInvoiceObj = {
      "_id": this.bookingConfirmId,
    };


    this.adminLayoutService.bookingPdf(downloadInvoiceObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        const base64URL = Response.data.body.data;
        const binary = base64URL;
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(binary);
        var byteArrays = [];
        byteArrays.push(view);
        const blob = new Blob(byteArrays, { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);
        downloadLink.href = url;
        var extension = "booking.pdf";
        downloadLink.download = new Date().getTime() + extension;
        downloadLink.target = '_blank';
        downloadLink.click();

      }
      else {
        //this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }
  downloadDecorationPdf() {


    let downloadInvoiceObj = {
      "inquirybookingID": this.bookingConfirmId,
    };


    this.adminLayoutService.bookingDecorationPdf(downloadInvoiceObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        const base64URL = Response.data.body.data;
        const binary = base64URL;
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(binary);
        var byteArrays = [];
        byteArrays.push(view);
        const blob = new Blob(byteArrays, { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const downloadLink = document.createElement('a');
        document.body.appendChild(downloadLink);
        downloadLink.href = url;
        var extension = "booking.pdf";
        downloadLink.download = new Date().getTime() + extension;
        downloadLink.target = '_blank';
        downloadLink.click();

      }
      else {
        //this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }



}
