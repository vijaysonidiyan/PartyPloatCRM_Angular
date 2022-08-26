import { Component, OnInit, ElementRef, Output, EventEmitter} from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router, RouterOutlet } from "@angular/router";
import { StorageKey, StorageService } from "app/shared/storage.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CoreHelperService } from "app/Providers/core-helper/core-helper.service";
import { CommonService } from "app/shared/common.service";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { Breadcrumb, BreadcrumbService } from "angular-crumbs";
import { Title } from "@angular/platform-browser";

declare const $: any;
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {

  changePasswordForm: FormGroup;
  userName = '';
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
  isDashboard = true;
  get fLoginData() { return this.changePasswordForm.controls; }

  constructor(public location: Location, private element: ElementRef, public storageService: StorageService, private router: Router, private fb: FormBuilder,  private coreHelper: CoreHelperService,  public commonService: CommonService, public adminLayoutService: AdminLayoutService,  private breadcrumbService: BreadcrumbService, private titleService: Title) {
    this.location = location;
    this.sidebarVisible = false;
  }
  @Output() navbarEvent = new EventEmitter<{navbarNativeElement:any}>()
  ngOnInit() {
    if (this.breadcrumbService.breadcrumbs[0].displayName  == "Dashboard"){
      this.isDashboard = true;
    }
    else{
      this.isDashboard = false;
    }
    this.breadcrumbService.breadcrumbChanged.subscribe((crumbs :any) => {
      this.titleService.setTitle(this.createTitle(crumbs));
    })
    this.userName = this.storageService.getValue(StorageKey.full_name) ? this.storageService.getValue(StorageKey.full_name) : this.storageService.getValue(StorageKey.email); 
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    debugger
    const navbar: HTMLElement = this.element.nativeElement;
    this.navbarEvent.emit({navbarNativeElement:navbar});
    this.defaultChangePasswordForm();
    this.toggleButton = navbar.getElementsByClassName("layout-menu-toggle")[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      // var $layer: any = document.getElementsByClassName("close-layer")[0];
      // if ($layer) {
      //   $layer.remove();
      //   this.mobile_menu_visible = 0;
      // }
    });
  }

  createTitle(routesCollection: Breadcrumb[]) {
    const title = 'Dashboard';
    const titles = routesCollection.filter((route) => route.displayName);

    if (!titles.length) { return title; }

    const routeTitle = this.titlesToString(titles);
    return `${routeTitle} ${title}`;
}

  private titlesToString(titles) {
      return titles.reduce((prev, curr) => {
          if (curr.displayName  == "Dashboard"){
            this.isDashboard = true;
          }
          else{
            this.isDashboard = false;
          }
          return `${curr.displayName} - ${prev}`;
      }, '');
  }
  getAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
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

    body.classList.add("layout-menu-expanded");

    this.sidebarVisible = true;
  }

  sidebarClose() {
    debugger
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("layout-menu-expanded");
  }

  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName("layout-menu-toggle")[0];

    //if (this.sidebarVisible === false) {
      this.sidebarOpen();
    // } else {
    //   this.sidebarClose();
    // }
    const body = document.getElementsByTagName("body")[0];

    // if (this.mobile_menu_visible == 1) {
    //   // $('html').removeClass('layout-menu-expanded');
    //   body.classList.remove("layout-menu-expanded");
    //   if ($layer) {
    //     $layer.remove();
    //   }
    //   setTimeout(function () {
    //     $toggle.classList.remove("toggled");
    //   }, 400);

    //   this.mobile_menu_visible = 0;
    // } else {
    //   setTimeout(function () {
    //     $toggle.classList.add("toggled");
    //   }, 430);

    //   var $layer = document.createElement("div");
    //   $layer.setAttribute("class", "close-layer");

    //   if (body.querySelectorAll(".main-panel")) {
    //     document.getElementsByClassName("main-panel")[0].appendChild($layer);
    //   } else if (body.classList.contains("off-canvas-sidebar")) {
    //     document
    //       .getElementsByClassName("wrapper-full-page")[0]
    //       .appendChild($layer);
    //   }

    //   setTimeout(function () {
    //     $layer.classList.add("visible");
    //   }, 100);

    //   $layer.onclick = function () {
    //     //asign a function
    //     body.classList.remove("layout-menu-expanded");
    //     this.mobile_menu_visible = 0;
    //     $layer.classList.remove("visible");
    //     setTimeout(function () {
    //       $layer.remove();
    //       $toggle.classList.remove("toggled");
    //     }, 400);
    //   }.bind(this);

    //   body.classList.add("layout-menu-expanded");
    //   this.mobile_menu_visible = 1;
    // }
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
