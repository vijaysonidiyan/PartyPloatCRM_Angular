import { Component, OnInit, ElementRef } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router } from "@angular/router";
import { StorageKey, StorageService } from "app/shared/storage.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreHelperService } from "app/Providers/core-helper/core-helper.service";
import { CommonService } from "app/shared/common.service";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";

declare const $: any;
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {

  changePasswordForm: FormGroup;

  staffList: any;
  partyplotList: any;
  private listTitles: any[];
  // location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  hide1 = false;
  hide2 = false;
  hide3 = false;
  submittedChangePasswordData = false;
  get fLoginData() { return this.changePasswordForm.controls; }

  constructor(public location: Location, private element: ElementRef, public storageService: StorageService, private router: Router, private fb: FormBuilder,  private coreHelper: CoreHelperService,  public commonService: CommonService, public adminLayoutService: AdminLayoutService) {
    this.location = location;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.defaultChangePasswordForm();
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
  }

  defaultChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      oldpwd: ['', [Validators.required]],
      newpwd: ['', [Validators.required, this.coreHelper.patternPasswordValidator()]],
      confirmPwd: ['', [Validators.required]],
    }, {
      validator: [this.coreHelper.MustMatch('newpwd', 'confirmPwd')]
    });
  }


  handleKeyUp(e: any) {
    if (e.keyCode === 13) {
      this.changePassword();
    }
  }
  cancelmyProfile() {
    $("#add-myprofile-modal").modal("hide");
  }
  myProfile() {
    $("#add-myprofile-modal").modal("show");
  }
  changePassword() {
    $("#change-password-modal").modal("show");
  }
  cancelchangePassword() {
    $("#change-password-modal").modal("hide");
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);

    body.classList.add("nav-open");

    this.sidebarVisible = true;
  }

  sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }

  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName("body")[0];

    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
      body.classList.remove("nav-open");
      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      if (body.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (body.classList.contains("off-canvas-sidebar")) {
        document
          .getElementsByClassName("wrapper-full-page")[0]
          .appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add("visible");
      }, 100);

      $layer.onclick = function () {
        //asign a function
        body.classList.remove("nav-open");
        this.mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      }.bind(this);

      body.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }

  updateChangepwd() {

    this.submittedChangePasswordData = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    let changepwdObj = {
      "oldpwd": this.changePasswordForm.value.oldpwd,
      "newpwd": this.changePasswordForm.value.newpwd
    }
    this.adminLayoutService.changePassword(changepwdObj).subscribe((Response: any) => {

      if (Response.meta.code == 200) {
        $("#change-password-modal").modal("hide");
        this.submittedChangePasswordData = false;
        this.defaultChangePasswordForm();
        this.commonService.notifier.notify('success', Response.meta.message);
        this.logout();
      }
      else {
        this.commonService.notifier.notify('error', Response.meta.message);
      }
    }, (error : any) => {
      console.log(error);
    });
  }

  logout() {
    this.storageService.removeValue(StorageKey.myToken);
    this.storageService.removeValue(StorageKey.roleId);
    this.storageService.removeValue(StorageKey.contact);
    this.storageService.removeValue(StorageKey.reference);
    this.storageService.removeValue(StorageKey.aadharcardNo);
    this.storageService.removeValue(StorageKey.lastName);
    this.storageService.removeValue(StorageKey.email);
    this.storageService.removeValue(StorageKey.full_name);
    this.storageService.removeValue(StorageKey.isUtsavDecoreLogin);
    this.router.navigate(["/admin-login/login"]);
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }
}
