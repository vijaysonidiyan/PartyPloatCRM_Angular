import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "app/shared/common.service";

@Injectable({
  providedIn: "root",
})
export class FrontLayoutService {
  environment: any;
  constructor(private commonService: CommonService, private http: HttpClient) {}

  getCricketbookinglistmonthwise(data: any) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'cricket/cricketbookinglistmonthwiseforWebsite', data, { headers: headers });
  }
  getpartyplotListforcricket() {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.get(this.commonService.rootData.rootUrl + 'cricket/partyplotlistforcricketforWebsite', {headers: headers });
  }
  slotListByDatewise(params) {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('myToken')}`
    })
    return this.http.post(this.commonService.rootData.rootUrl + 'cricket/slotlistdateviseforWebsite', params, { headers: headers });
  }

}
