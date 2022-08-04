import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from 'app/shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class AdminLayoutService {

  constructor(private commonService: CommonService, private http: HttpClient) { }

  // ============== Role Master =========== //

  getroleMaster() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'roleMaster/roleList', { headers: headers });
  }

  SaveroleMaster(createroleMasterData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'roleMaster/roleSave', createroleMasterData, { headers: headers });
  }

  getroleMasterId(params: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'roleMaster/rolegetById', { params: params, headers: headers });
  }

  UpdateroleMaster(updateroleMasterData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'roleMaster/roleUpdate', updateroleMasterData, { headers: headers });
  }

  StatusroleMaster(updatestatusroleMasterData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'roleMaster/roleStatusupdate', updatestatusroleMasterData, { headers: headers });
  }

  // ============== Menu Master =========== //

  getPerentList() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'menuMaster/parentList', { headers: headers });
  }

  getmenu() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'menuMaster/menuList', { headers: headers });
  }

  Savemenu(createroleMasterData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'menuMaster/menuSave', createroleMasterData, { headers: headers });
  }

  Updatemenu(updatemenuData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'menuMaster/menuUpdateById', updatemenuData, { headers: headers });
  }

  getmenuId(params: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'menuMaster/menugetById', { params: params, headers: headers });
  }

  Statusmenu(updatestatusmenuData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'menuMaster/menuStatusupdate', updatestatusmenuData, { headers: headers });
  }

  // ============== Role Wise Menu =========== //

  getRoleList() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'roleMaster/roleActiveList', { headers: headers });
  }

  // ============== Facility Master Menu =========== //

  getfacilityMaster() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'facility/facilityList', { headers: headers });
  }

  SavefacilityMaster(createroleMasterData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'facility/facilityCreate', createroleMasterData, { headers: headers });
  }

  getfacilityMasterId(params: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'facility/facilityListById', { params: params, headers: headers });
  }

  UpdatefacilityMaster(updateroleMasterData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'facility/facilityUpdate', updateroleMasterData, { headers: headers });
  }

  StatusfacilityMaster(updatestatusroleMasterData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'facility/facilityStatusupdate', updatestatusroleMasterData, { headers: headers });
  }

  // ============== Party Plot Master =========== //

  getpartyplotMaster() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'partyplot/partyplotList', { headers: headers });
  }

  SavepartyplotMaster(createroleMasterData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'partyplot/partyplotCreate', createroleMasterData, { headers: headers });
  }

  getpartyplotMasterId(params: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'partyplot/partyplotListById', { params: params, headers: headers });
  }

  UpdatepartyplotMaster(updateroleMasterData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'partyplot/partyplotUpdate', updateroleMasterData, { headers: headers });
  }

  StatuspartyplotMaster(updatestatusroleMasterData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'partyplot/partyplotStatusupdate', updatestatusroleMasterData, { headers: headers });
  }

  getfacilityActiveList() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'facility/ActivefacilityList', { headers: headers });
  }
  
}
