import { Component, OnInit } from '@angular/core';
import { AdminLayoutService } from './layouts/admin-layout/admin-layout.service';
import { StorageKey, StorageService } from './shared/storage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(public storageService: StorageService, public adminLayoutService: AdminLayoutService) {
    this.adminLayoutService.getComapnysetting().subscribe((x: any) => {
      if (x.meta.code == 200) {
        this.storageService.setValue(StorageKey.utsav_decor_logo, x.data.logo);
      }
    })
  }

  ngOnInit(): void {


  }





}
