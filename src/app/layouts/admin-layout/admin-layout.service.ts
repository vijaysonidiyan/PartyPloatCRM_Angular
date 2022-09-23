import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class AdminLayoutService {

  constructor(private commonService: CommonService, private http: HttpClient, public router: Router) { }

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

  // ============== Module Master =========== //

  getModuleMaster() {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'moduleMaster/moduleList', { headers: headers });
  }

  SaveModuleMaster(createModuleMasterData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'moduleMaster/moduleSave', createModuleMasterData, { headers: headers });
  }

  getModuleMasterId(params: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'moduleMaster/modulegetById', { params: params, headers: headers });
  }

  UpdateModuleMaster(updateModuleMasterData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'moduleMaster/moduleUpdateById', updateModuleMasterData, { headers: headers });
  }

  StatusModuleMaster(updatestatusModuleMasterData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'moduleMaster/moduleStatusupdate', updatestatusModuleMasterData, { headers: headers });
  }

  getModuleActiveList() {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'moduleMaster/ActiveModuleList', { headers: headers });
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
  getUserListByRoleId(roleId: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'rolewiseMenu/userListRolewise', { params: roleId, headers: headers });
  }

  getRolewisemenuList(params: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'rolewiseMenu/roleWiseMenuList', { params: params, headers: headers });
  }
  getUserwisemenuList(params: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'userwiseMenu/userWiseMenuList', { params: params, headers: headers });
  }

  SaverolewiseMenu(rolewisemenuData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'rolewiseMenu/roleWiseMenu-Save', rolewisemenuData, { headers: headers });
  }
  SaveUserwiseMenu(rolewisemenuData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'userwiseMenu/userWiseMenu-Save', rolewisemenuData, { headers: headers });
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

  assignpartyplotUserWiseList() {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'partyplot/assignpartyplotUserWise', { headers: headers });
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

  saveDocumentbystaffId(staffDocumentData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'staff/documentSave', staffDocumentData, { headers: headers });
  }

  getstaffId(params: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'staff/staff-getById', { params: params, headers: headers });
  }

  getDocumentbyStaffId(params: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'staff/documentgetByStaffId', { params: params, headers: headers });
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

  staffDocumentDelete(params: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'staff/documentdeleteById', { params: params, headers: headers });
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
  // ============== Client Inquiry =========== //

  createClientinquiry(createvendorDetailsData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientinquiry/clientinquiryCreate', createvendorDetailsData, { headers: headers });
  }

  getInquiryList(data: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientinquiry/eventinquiryList', data, { headers: headers });
  }

  getInquiryById(data: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientinquiry/eventListgetByclientId', data, { headers: headers });
  }

  getInquiryListForCalenderView(data: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientinquiry/EvetListgetByMothWise', data, { headers: headers });
  }

  getInquiryListByDate(data: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientinquiry/eventListgetByDate', data, { headers: headers });
  }

  StatusInquiry(updatestatusInquiryData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientinquiry/clientinquiryStatusupdate', updatestatusInquiryData, { headers: headers });
  }

  updateClientinquiry(updateClientInquiryData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientinquiry/clientinquiryUpdate', updateClientInquiryData, { headers: headers });
  }

  bookInquiryApproved(updateClientInquiryData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientinquiry/clientinquiryapprovalStatusupdate', updateClientInquiryData, { headers: headers });
  }
  cancelBookingInquiry(updateClientInquiryData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientinquiry/eventinquiryapprovalStatusupdate', updateClientInquiryData, { headers: headers });
  }

  updateClientinquiryData(updateClientInquiryDetailsData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientinquiry/clientinquiryUpdate', updateClientInquiryDetailsData, { headers: headers });
  }

  getClientDetailsByInquiryId(clientId: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'clientinquiry/clientListgetById', { params: clientId, headers: headers });
  }

  getEventDetailsByInquiryId(clientId: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'clientinquiry/eventDatagetById', { params: clientId, headers: headers });
  }

  deleteEventByID(deleteEventId: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'clientinquiry/event_inquiryDelete', { params: deleteEventId, headers: headers });
  }

  updateEventInquiryData(updateEventInquiryDetailsData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientinquiry/eventInquiryUpdate', updateEventInquiryDetailsData, { headers: headers });
  }
  saveEventInquiryData(saveEventInquiryDetailsData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'clientinquiry/eventinquiryaddbyclientID', saveEventInquiryDetailsData, { headers: headers });
  }

  // ============== Company Setting =========== //

  getComapnysetting() {
    return this.http.get(this.commonService.rootData.rootUrl + 'companySetting/companysettingList');
  }

  UpdateCompanySetting(companySettingData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'companySetting/companySettingCreate', companySettingData, { headers: headers });
  }

  // ============== Company Setting =========== //

  getSideMenuList() {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'userwiseMenu/sideMenu-List', { headers: headers });
  }

  // ============== Reference Master =========== //

  getreferenceMaster() {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'reference/referenceList', { headers: headers });
  }

  SavereferenceMaster(createreferenceMasterData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'reference/referenceSave', createreferenceMasterData, { headers: headers });
  }

  getreferenceMasterId(params: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'reference/referencegetById', { params: params, headers: headers });
  }

  UpdatereferenceMaster(updatereferenceMasterData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'reference/referenceUpdate', updatereferenceMasterData, { headers: headers });
  }

  StatusreferenceMaster(updatestatusreferenceMasterData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'reference/referenceStatusupdate', updatestatusreferenceMasterData, { headers: headers });
  }

  getReferenceActiveList() {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'reference/referenceActiveList', { headers: headers });
  }

  // package master 
  savePackageMaster(packageMasterSaveData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'packageMaster/packageCreate', packageMasterSaveData, { headers: headers });
  }
  updatePackageMaster(packageMasterUpdateData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'packageMaster/packageUpdate', packageMasterUpdateData, { headers: headers });
  }
  statusPackageMaster(packageMasterUpdateData: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'packageMaster/packageStatusupdate', packageMasterUpdateData, { headers: headers });
  }
  getPackageMasterListById(Id: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'packageMaster/packageListByID', { params: Id, headers: headers });
  }
  getPackageMasterList() {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'packageMaster/packageList', { headers: headers });
  }
  getActivePackageMasterListByPartyPlotId(partyPlotId: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'packageMaster/ActivePackageList', { params: partyPlotId, headers: headers });
  }

  // book inquiry api calling 
  getClientDetailsByEventId(id: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'clientinquiry/eventListgetById', { params: id, headers: headers });
  }
  confirmBookingInquiryEvent(data: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'inquirybooking/inquirybookingSave', data, { headers: headers });
  }

  // bookging confirm list 
  getBookingConfirmListDetails(id: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'inquirybooking/inquirydeatilsbypartyplotID', { params: id, headers: headers });
  }
  getBookingConfirmListByBookingID(id: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'inquirybooking/inquirybookinggetByID', { params: id, headers: headers });
  }

  // view booking list and update package and extra item
  updatePackageItemDataList(data: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'inquirybooking/packageUpdate', data, { headers: headers });
  }
  updateExtraItemDataList(data: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'inquirybooking/extradecorationUpdate', data, { headers: headers });
  }

  // image decoration file upload and list
  imageDecorationCreate(data: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'decoration/decorationCreate', data, { headers: headers });
  }
  imageDecorationUpdate(data: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'decoration/decorationUpdate', data, { headers: headers });
  }
  getImageDecorationListByBookingId(id: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'decoration/decorationListbyinquirybookingId', { params: id, headers: headers });
  }
  getDecorationImagebyId(id: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'decoration/decorationListByID', { params: id, headers: headers });
  }
  deleteDecorationbyId(id: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'decoration/decorationDelete', { params: id, headers: headers });
  }
}


