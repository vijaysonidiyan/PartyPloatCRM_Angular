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

  Savemenu(createmenuMasterData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'menuMaster/menuSave', createmenuMasterData, { headers: headers });
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

  getRoleActiveList() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'roleMaster/roleActiveList', { headers: headers });
  }

  getRolewisemenuList(params: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'rolewiseMenu/roleWiseMenuList', { params: params, headers: headers });
  }

  SaverolewiseMenu(rolewisemenuData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'rolewiseMenu/roleWiseMenu-Save', rolewisemenuData, { headers: headers });
  }

  // ============== Event Master Menu =========== //

  geteventMaster() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'event/eventList', { headers: headers });
  }

  SaveeventMaster(createeventMasterData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'event/eventCreate', createeventMasterData, { headers: headers });
  }

  geteventMasterId(params: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'event/eventListById', { params: params, headers: headers });
  }

  UpdateeventMaster(updateeventMasterData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'event/eventUpdate', updateeventMasterData, { headers: headers });
  }

  StatuseventMaster(updatestatuseventMasterData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'event/eventStatusupdate', updatestatuseventMasterData, { headers: headers });
  }
  geteventActiveList() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'event/ActiveEventList', { headers: headers });
  }

  // ============== Party Plot Master =========== //

  getpartyplotMaster() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'partyplot/partyplotList', { headers: headers });
  }

  SavepartyplotMaster(createpartPlotData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'partyplot/partyplotCreate', createpartPlotData, { headers: headers });
  }

  getpartyplotMasterId(params: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'partyplot/partyplotListById', { params: params, headers: headers });
  }

  UpdatepartyplotMaster(updatepartyPlotData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'partyplot/partyplotUpdate', updatepartyPlotData, { headers: headers });
  }

  StatuspartyplotMaster(updatestatuspartyPlotData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'partyplot/partyplotStatusupdate', updatestatuspartyPlotData, { headers: headers });
  }


  getPartyplotActiveList() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'partyplot/ActivePartyplotList', { headers: headers });
  }

  // ============== Staff =========== //

  getStaff() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'staff/staff-List', { headers: headers });
  }
  
  saveStaff(createstaffData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'staff/create', createstaffData, { headers: headers });
  }

  getstaffId(params: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'staff/staff-getById', { params: params, headers: headers });
  }

  updateStaff(staffData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'staff/staffDetailsUpdate', staffData, { headers: headers });
  }

  StatusStaff(staffData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'staff/staffActiveDeActive', staffData, { headers: headers });
  }

  changePassword(updatechangepwdData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'staff/ChangePassword', updatechangepwdData, { headers: headers });
  }

  forgotPassword(forgotpwdData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'staff/forgotPassworForStaff', forgotpwdData, { headers: headers });
  }

  reSendOtp(forgotpwdData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'staff/resendOTP', forgotpwdData, { headers: headers });
  }

  otpVerification(forgotpwdData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'staff/checkOtpVerificationUserForForgotPasssword', forgotpwdData, { headers: headers });
  }

  resetPassword(resetpwdData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'staff/resetPassword', resetpwdData, { headers: headers });
  }
  
  // ============== Vendor Details =========== //

  getvendorDetails() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'venderDetails/venderList', { headers: headers });
  }

  SavevendorDetails(createvendorDetailsData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'venderDetails/venderDetailsCreate', createvendorDetailsData, { headers: headers });
  }

  getvendorDetailsId(params: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'venderDetails/venderListById', { params: params, headers: headers });
  }

  UpdatevendorDetails(updatevendorDetailsData: any) {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'venderDetails/venderUpdate', updatevendorDetailsData, { headers: headers });
  }

  StatusvendorDetails(updatestatusvendorDetailsData: any) {
      let headers = new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('myToken')}`
      })
      return this.http.post(this.commonService.rootData.rootUrl + 'venderDetails/venderActiveDeActive', updatestatusvendorDetailsData, { headers: headers });
  }

  getvendorActiveList() {
    let headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'venderDetails/ActivevenderList', { headers: headers });
  }
}