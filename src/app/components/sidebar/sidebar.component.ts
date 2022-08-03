import { Component, OnInit } from "@angular/core";

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
  isSettingOpen: boolean = false;
  istoggle: boolean | any = false;
  isSettingActive: boolean = false;
  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  settingMenu() {
    this.isSettingOpen = !this.isSettingOpen;
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
}
