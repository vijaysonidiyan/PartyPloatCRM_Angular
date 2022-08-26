import { Component, OnInit, ElementRef, Input } from "@angular/core";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { CommonService } from "app/shared/common.service";
import { StorageKey, StorageService } from "app/shared/storage.service";
import { environment } from "environments/environment";
import { NavbarComponent } from "../navbar/navbar.component";
declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/admin/dashboard",
    title: "Dashboard",
    icon: "dashboard",
    class: "",
  },
  {
    path: "/admin/user-profile",
    title: "User Profile",
    icon: "person",
    class: "",
  },
  {
    path: "/admin/table-list",
    title: "Table List",
    icon: "content_paste",
    class: "",
  },
  {
    path: "/admin/typography",
    title: "Typography",
    icon: "library_books",
    class: "",
  },
  { path: "/admin/icons", title: "Icons", icon: "bubble_chart", class: "" },
  { path: "/admin/maps", title: "Maps", icon: "location_on", class: "" },
  {
    path: "/admin/notifications",
    title: "Notifications",
    icon: "notifications",
    class: "",
  },
  {
    path: "/admin/upgrade",
    title: "Upgrade to PRO",
    icon: "unarchive",
    class: "active-pro",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  activeMenu: any;
  iconactive: boolean = false;
  isSettingOpen = {};
  istoggle: boolean | any = false;
  isSettingActive: boolean = false;
  noData: boolean;
  utsav_logo_img: any;
  uploadsUrl: any;
  private toggleButton: any;
  navbar: any;

  constructor(public commonService: CommonService,private element: ElementRef, public adminLayoutService: AdminLayoutService, public storageService: StorageService) {
    this.uploadsUrl = environment.uploadedUrl
    this.utsav_logo_img = this.storageService.getValue(StorageKey.utsav_decor_logo);
  }
  @ Input() set navbarNativeElement(value: any) {
    debugger
    if(!!value) {
      this.navbar = value.navbarNativeElement;
    }
   }
  iconDefaultURL = environment.uploadsUrl + 'default_icon/'
  iconActiveURL = environment.uploadsUrl + 'active_icon/'


  ngOnInit() {
    
    // this.utsav_logo_img = environment.uploadedUrl + this.storageService.getValue(StorageKey.utsav_decor_logo)
    this.getSideMenuList();
    // this.menuItems = ROUTES.filter((menuItem) => menuItem);
    // setTimeout(() => {
    //   this.utsav_logo_img = environment.uploadedUrl + this.storageService.getValue(StorageKey.utsav_decor_logo)
    // }, 0);
  }
  childrenMenu(index: any) {
    debugger
    this.isSettingOpen[index] = !this.isSettingOpen[index];
  }
  toggle() {
    this.istoggle = !this.istoggle;
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  isActive(menuName: any) {
    this.activeMenu = menuName;
    //this.isSettingActive = false;
  }
  isActivesetting(menuName: any) {
    this.activeMenu = menuName;
    this.isSettingActive = true;
  }

  reInializeChildMenu() {
    this.isSettingOpen = {};
  }

  getSideMenuList() {
    this.adminLayoutService.getSideMenuList().subscribe(
      (Response: any) => {
        if (Response.meta.code == 200) {
          this.menuItems = Response.data.sort((a, b) => a.order - b.order);
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

  sidebarClose() {
    debugger

    //const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = this.navbar.getElementsByClassName("layout-menu-toggle")[0];
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    //this.sidebarVisible = false;
    body.classList.remove("layout-menu-expanded");
  }
}
