import { Component, OnInit, ElementRef, Output, EventEmitter } from "@angular/core";
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
import { Title } from "@angular/platform-browser";
import { parseJSON } from "jquery";

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
  StaffDocumentList: any[];
  staffForm: FormGroup;
  activeroleList: any;
  profieImage: any
  profileImageIconUrl: any;
  get fLoginData() { return this.changePasswordForm.controls; }

  constructor(public location: Location, private element: ElementRef, public storageService: StorageService, private router: Router, private fb: FormBuilder, private coreHelper: CoreHelperService, public commonService: CommonService, public adminLayoutService: AdminLayoutService, private titleService: Title) {
    this.location = location;
    this.sidebarVisible = false;
  }
  @Output() navbarEvent = new EventEmitter<{ navbarNativeElement: any }>()
  ngOnInit() {
    this.defaultForm();
    this.getpartyplotActiveList();
    this.getRoleActiveList();
    // if (this.breadcrumbService.breadcrumbs[0].displayName == "Dashboard") {
    //   this.isDashboard = true;
    // }
    // else {
    //   this.isDashboard = false;
    // }
    // this.breadcrumbService.breadcrumbChanged.subscribe((crumbs: any) => {
    //   this.titleService.setTitle(this.createTitle(crumbs));
    // })
    let localstorage = JSON.parse(localStorage.getItem('LoginUserData'))
    this.profieImage = this.commonService.rootData.uploadsUrl + 'photos/' + localstorage.profile_image
    this.userName = this.storageService.getValue(StorageKey.full_name) ? this.storageService.getValue(StorageKey.full_name) : this.storageService.getValue(StorageKey.email);
    this.listTitles = ROUTES.filter((listTitle) => listTitle);

    const navbar: HTMLElement = this.element.nativeElement;
    this.navbarEvent.emit({ navbarNativeElement: navbar });
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
  // createTitle(routesCollection: Breadcrumb[]) {
  //   const title = 'Dashboard';
  //   const titles = routesCollection.filter((route) => route.displayName);

  //   if (!titles.length) { return title; }

  //   const routeTitle = this.titlesToString(titles);
  //   return `${routeTitle} ${title}`;
  // }

  private titlesToString(titles) {
    return titles.reduce((prev, curr) => {
      if (curr.displayName == "Dashboard") {
        this.isDashboard = true;
      }
      else {
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
    let id = parseJSON(localStorage.getItem('LoginUserData'))._id

    let Id: any = { staffId: id };
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
        this.staffForm.controls.partyplotData.setValue(Response.data.partyplotData);
        this.staffForm.controls.isLogin.setValue(Response.data.isLogin);
        this.StaffDocumentList = Response.data.Staff_documentData;
        this.profileImageIconUrl = this.commonService.rootData.uploadsUrl + 'photos/' + Response.data.profile_image
        $("#add-myprofile-modal").modal("show");
      },
      (error) => { }
    );
  }

  changePassword() {
    this.submittedChangePasswordData = false;
    this.defaultChangePasswordForm();
    $("#change-password-modal").modal("show");
  }
  cancelchangePassword() {
    this.submittedChangePasswordData = false;
    this.defaultChangePasswordForm();
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
    }, (error: any) => {
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
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    if (titlee.charAt(0) === '?') {
      titlee = titlee.slice(1);
    }
    if (titlee.includes('dashboard')) {
      return {
        pastPage: [],
        currentPageName: 'Dashboard'
      };
    }
    else if (titlee.includes('event-master')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Event Master'
      };
    }
    else if (titlee.includes('party-plot-master')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Party Plot Master'
      };
    }

    else if (titlee.includes('add-package-master')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        },
        {
          pastUrl: 'package-master',
          pastLinkName: 'Package Master',
        }],
        currentPageName: 'Add Package Master'
      };
    }
    else if (titlee.includes('edit-package-master')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        },
        {
          pastUrl: 'package-master',
          pastLinkName: 'Package Master',
        }],
        currentPageName: 'Edit Package Master'
      };
    }
    else if (titlee.includes('package-master')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Package Master'
      };
    }
    else if (titlee.includes('staff')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Staff'
      };
    }
    else if (titlee.includes('vendor-details')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Vendor Details'
      };
    }

    else if (titlee.includes('add-inquiry')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }, {
          pastUrl: 'inquiry/calender-view',
          pastLinkName: 'Inquiry',
        }],
        currentPageName: 'Add Inquiry'
      };
    }
    else if (titlee.includes('view-inquiry')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }, {
          pastUrl: 'inquiry/calender-view',
          pastLinkName: 'Inquiry',
        }],
        currentPageName: 'View Inquiry'
      };
    }

    else if (titlee.includes('list-view')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Inquiry'
      };
    }
    else if (titlee.includes('calender-view')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Inquiry'
      };
    }
    else if (titlee.includes('booking-confirm-list')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Booking Confirm'
      };
    }
    else if (titlee.includes('view-booking-confirm')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }, {
          pastUrl: 'booking-confirm-list',
          pastLinkName: 'Booking Confirm',
        }],
        currentPageName: 'View Booking Confirm'
      };
    }
    else if (titlee.includes('booking-confirm')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }, {
          pastUrl: 'inquiry/calender-view',
          pastLinkName: 'Inquiry',
        }],
        currentPageName: 'Booking Confirm'
      };
    }
    else if (titlee.includes('menu-master')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Menu Master'
      };
    }
    else if (titlee.includes('module-master')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Module Master'
      };
    }
    else if (titlee.includes('role-master')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Role Master'
      };
    }
    else if (titlee.includes('role-wise-menu')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Role Wise Menu'
      };
    }
    else if (titlee.includes('user-wise-menu')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'User Wise Menu'
      };
    }
    else if (titlee.includes('company-setting')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Company Setting'
      };
    }
    else if (titlee.includes('reference-master')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Reference Master'
      };
    }
    else if (titlee.includes('cricket-booking')) {
      return {
        pastPage: [{
          pastUrl: 'dashboard',
          pastLinkName: 'Dashboard',
        }],
        currentPageName: 'Cricket Booking'
      };
    }
  }
}

