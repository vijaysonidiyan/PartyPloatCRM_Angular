import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
declare const $: any;
@Component({
  selector: "app-staff",
  templateUrl: "./staff.component.html",
  styleUrls: ["./staff.component.css"],
})
export class StaffComponent implements OnInit {
  partyplotList: any;
  activeroleList: any;
  staffForm: FormGroup;
  ISeditStaff = false;
  ISviewStaff = false;
  staffList: any[];
  allstaffList: any[];
  StaffList: any[];
  l: number;
  p: number = 1;
  itemsPage: any;
  staffIndex: number;
  staffListlength: any;
  noData;
  filedocument: any;
  imgURLlogo: any;
  userFile: any[] = [];
  attactDocument: any = {};

  @ViewChild('filedocument') fileDocument: ElementRef;
  StaffDocumentList: any;
  documentError: boolean = false;

  get fnameData() {
    return this.staffForm.controls;
  }
  submittedStaffData = false;
  partyplotInvalid = false;
  roleInvalid = false;
  isView: boolean;
  isCreated: boolean;
  isUpdated: boolean;
  isDeleted: boolean;

  profileImageIconFile: any;
  profileImageIcon: any;
  profileImageIconUrl: string | ArrayBuffer;
  @ViewChild('profileImageIcon') profileImageIconVariable: ElementRef;

  constructor(
    public commonService: CommonService,
    public adminLayoutService: AdminLayoutService,
    private fb: FormBuilder, private router: Router
  ) {
    let pagePermission = { module: "staff" }
    this.adminLayoutService.getpagePermission(pagePermission).subscribe((Response: any) => {

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
  }

  ngOnInit(): void {
    this.noData = false;
    this.l = 10;
    this.ISeditStaff = false;
    this.ISviewStaff = false;
    this.getStaffList();
    this.getpartyplotActiveList();
    this.getRoleActiveList();
    this.defaultForm();
  }
  removeDocument(index) {
    this.userFile.splice(index, 1);
  }

  onDocumentChange(event) {
    debugger

    var selectedFiles = event.target.files;
    for (var i = 0; i < selectedFiles.length; i++) {
      this.userFile.push(selectedFiles[i]);
      // this.resultName.push(selectedFiles[i].name);
    }
    event.target.value = '';

    // this.userFile = event.target.files[0];
    // if (!!this.userFile) {
    //   this.documentError = false;
    // }
    // else {
    //   this.documentError = true
    // }
    // this.filedocument = this.userFile.name;
    // if (event.target.files && event.target.files[0]) {
    //   const reader = new FileReader();
    //   reader.onload = (e: any) => {
    //     this.imgURLlogo = e.target.result;
    //   };
    //   reader.readAsDataURL(event.target.files[0]);
    // }
    this.fileDocument.nativeElement.value = "";

    // this.userFile = event.target.files;
    // for (var i = 0; i < selectedFiles.length; i++) {
    //   this.userFile.push(selectedFiles[i]);
    //   // this.resultName.push(selectedFiles[i].name);
    // }
    // event.target.value = '';
  }
  defaultForm() {
    this.staffForm = this.fb.group({
      _id: ["0"],
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      contact: ["", [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      roleId: [null, [Validators.required]],
      reference: [""],
      // aadharcardNo: [""],
      partyplotData: ["", [Validators.required]],
      roleName: [""],
      isLogin: false
    });
  }

  onProfileIconChange(event: any) {

    this.profileImageIconFile = event.target.files[0];
    this.profileImageIcon = this.profileImageIconFile.name;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageIconUrl = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    this.profileImageIconVariable.nativeElement.value = this.profileImageIcon;
  }
  removeProfileIcon() {
    console.log('nativeeletment', this.profileImageIconVariable.nativeElement)
    console.log('value', this.profileImageIconVariable.nativeElement.value)
    this.profileImageIconUrl = '';
    this.profileImageIconFile = '';
    this.profileImageIcon = '';
    // this.menuForm.controls.profileImageIcon.setValue('');
    this.profileImageIconVariable.nativeElement.value = "";
  }

  addStaff() {
    $("#add-staff-modal").modal("show");
    this.ISeditStaff = false;
    this.ISviewStaff = false;
    this.submittedStaffData = false;
    this.profileImageIconFile = '';
    this.profileImageIconUrl = '';
    this.profileImageIcon = '';
    this.profileImageIconVariable.nativeElement.value = "";
    this.staffForm.enable()
  }

  cancelStaff() {
    $("#add-staff-modal").modal("hide");
    this.defaultForm();
    this.profileImageIconFile = '';
    this.profileImageIconUrl = '';
    this.profileImageIcon = '';
    this.profileImageIconVariable.nativeElement.value = "";

    this.ISeditStaff = false;
    this.ISviewStaff = false;
    this.submittedStaffData = false;
    this.StaffDocumentList = [];
    this.staffForm.enable()
  }
  addDoc() {
    this.documentError = false;
    $("#add-staff-modal").modal("hide");
    $("#add-document-modal").modal("show");
  }

  cancelDoc() {
    this.documentError = false;
    $("#add-staff-modal").modal("show");
    $("#add-document-modal").modal("hide");
  }

  isloginOnchange(paramsObj) {
    let checked = paramsObj.checked;
    if (checked == true) {
      this.staffForm.controls.isLogin.setValue(true)
    } else {
      this.staffForm.controls.isLogin.setValue(false)
    }
  }

  getStaffList() {
    this.adminLayoutService.getStaff().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.StaffList = Response.data;
          this.staffList = this.StaffList;
          this.allstaffList = this.staffList;
          this.staffList = this.StaffList.slice();
          this.staffListlength = Response.data.length;
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

  getpartyplotActiveList() {
    this.adminLayoutService.getPartyplotActiveList().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.partyplotList = Response.data;
        } else {
        }
        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      }
    );
  }
  getRoleActiveList() {
    this.adminLayoutService.getRoleActiveList().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.activeroleList = Response.data;
        } else {
        }
        //for select sub industry step
      },
      (error) => {
        console.log(error.error.Message);
      });
  }
  savedoc() {
    if (this.userFile == null) {
      this.documentError = true;
      return
    }
    let staffDocumentModelObj: FormData = new FormData();

    staffDocumentModelObj.append('staffId', this.staffForm.value._id);

    this.userFile.map((obj: any) => {

      staffDocumentModelObj.append('documents', obj);
      console.log(obj);
    });


    this.adminLayoutService.saveDocumentbystaffId(staffDocumentModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.userFile = null;
          this.getStaffDocument();
          this.commonService.notifier.notify("success", "Document Uploaded Successfully.");
          $("#add-staff-modal").modal("show");
          $("#add-document-modal").modal("hide");
        }
      },
      (error) => {
        console.log(error.error.Message);
      });
  }
  savestaff() {

    if (this.staffForm.invalid) {
      this.submittedStaffData = true;
      return;
    }

    let staffModelObj: FormData = new FormData();

    staffModelObj.append('name', this.staffForm.value.name);
    staffModelObj.append('email', this.staffForm.value.email);
    staffModelObj.append('contact', this.staffForm.value.contact);
    staffModelObj.append('roleId', this.staffForm.value.roleId);
    staffModelObj.append('reference', this.staffForm.value.reference);
    staffModelObj.append('assignPartyPlot', JSON.stringify(this.staffForm.value.partyplotData));
    staffModelObj.append('isLogin', this.staffForm.value.isLogin);
    staffModelObj.append('profile_image', this.profileImageIconFile);

    this.adminLayoutService.saveStaff(staffModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedStaffData = false;
          this.getStaffList();
          this.defaultForm();
          this.StaffDocumentList = [];
          this.ISeditStaff = false;
          this.ISviewStaff = false;
          this.commonService.notifier.notify("success", "Staff Details Saved Successfully.");
          $("#add-staff-modal").modal("hide");
        } else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editStaff(paramsObj) {
    if (paramsObj.action == 'edit') {
      this.ISeditStaff = true;
      this.staffForm.enable()
    } else if (paramsObj.action == 'view') {
      this.ISviewStaff = true;
      this.staffForm.disable()
    }
    let Id: any = { staffId: paramsObj.id };
    this.StaffDocumentList = [];
    this.adminLayoutService.getstaffId(Id).subscribe(
      (Response: any) => {
        this.staffForm.controls._id.setValue(Response.data._id);
        this.staffForm.controls.name.setValue(Response.data.name);
        this.staffForm.controls.email.setValue(Response.data.email);
        this.staffForm.controls.contact.setValue(Response.data.contact);
        this.staffForm.controls.roleId.setValue(Response.data.roleId);
        this.staffForm.controls.reference.setValue(Response.data.reference);
        //this.staffForm.controls.aadharcardNo.setValue(Response.data.aadharcardNo);
        this.staffForm.controls.partyplotData.setValue(Response.data.assignPartyPlot);
        this.staffForm.controls.isLogin.setValue(Response.data.isLogin);
        this.StaffDocumentList = Response.data.Staff_documentData;
        if (Response.data.profile_image) {
          this.profileImageIconFile = Response.data.profile_image
          this.profileImageIconUrl = this.commonService.rootData.uploadsUrl + 'photos/' + Response.data.profile_image
        }
        this.getStaffDocument()

        $("#add-staff-modal").modal("show");
      },
      (error) => { }
    );
  }

  getStaffDocument() {
    let Id: any = { staffId: this.staffForm.controls._id.value };
    this.StaffDocumentList = [];
    this.adminLayoutService.getDocumentbyStaffId(Id).subscribe(
      (Response: any) => {
        this.StaffDocumentList = Response.data;
      },
      (error) => { }
    );
  }

  updatestaff() {

    if (this.staffForm.invalid) {
      this.submittedStaffData = true;
      return;
    }

    let staffModelObj: FormData = new FormData();

    staffModelObj.append('_id', this.staffForm.value._id);
    staffModelObj.append('name', this.staffForm.value.name);
    staffModelObj.append('email', this.staffForm.value.email);
    staffModelObj.append('contact', this.staffForm.value.contact);
    staffModelObj.append('roleId', this.staffForm.value.roleId);
    staffModelObj.append('reference', this.staffForm.value.reference);
    staffModelObj.append('assignPartyPlot', JSON.stringify(this.staffForm.value.partyplotData));
    staffModelObj.append('isLogin', this.staffForm.value.isLogin);
    staffModelObj.append('profile_image', this.profileImageIconFile);

    this.adminLayoutService.updateStaff(staffModelObj).subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.submittedStaffData = false;
          this.getStaffList();
          this.defaultForm();
          this.StaffDocumentList = [];
          this.ISeditStaff = false;
          this.ISviewStaff = false;
          this.commonService.notifier.notify("success", "Staff Details Updated Successfully.");
          $("#add-staff-modal").modal("hide");
        } else {
          this.commonService.notifier.notify("error", Response.meta.message);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deletDocument(id: any) {
    let modelObj = {
      "_id": id,
    };

    this.adminLayoutService.staffDocumentDelete(modelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedStaffData = false;
        this.getStaffDocument();
        this.commonService.notifier.notify('success', "Document Deleted Successfully.");
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  statusStaffmaster(paramsObj) {

    let statusstaffmasterModelObj = {
      "_id": paramsObj.id,
      "status": paramsObj.status
    };

    this.adminLayoutService.StatusStaff(statusstaffmasterModelObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        this.submittedStaffData = false;
        this.getStaffList();
        this.defaultForm();
        this.ISeditStaff = false;
        this.ISviewStaff = false;
        if (paramsObj.status == 1) {
          this.commonService.notifier.notify("success", "Staff Actived Successfully.");
        }
        else {
          this.commonService.notifier.notify("success", "Staff Deactived Successfully.");
        }
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  search(value: string): void {
    this.staffList = this.allstaffList.filter((val: any) => JSON.stringify(val).toLowerCase().includes(value.toLowerCase()));
    this.p = 1;
    if (this.staffList.length == 0) {

      this.noData = true;
    } else {
      this.noData = false;
    }
  }
}
