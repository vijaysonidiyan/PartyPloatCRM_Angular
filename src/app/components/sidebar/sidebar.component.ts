import { Component, OnInit } from "@angular/core";
import { AdminLayoutService } from "app/layouts/admin-layout/admin-layout.service";
import { StorageKey, StorageService } from "app/shared/storage.service";
import { environment } from "environments/environment";

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
  constructor(public adminLayoutService: AdminLayoutService, public storageService: StorageService) { }

  iconDefaultURL = environment.uploadsUrl + 'default_icon/'
  iconActiveURL = environment.uploadsUrl + 'active_icon/'


  ngOnInit() {
    this.getSideMenuList();
    // this.menuItems = ROUTES.filter((menuItem) => menuItem);
    setTimeout(() => {
      this.utsav_logo_img = environment.uploadedUrl + this.storageService.getValue(StorageKey.utsav_decor_logo)
  }, 0);
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

}
