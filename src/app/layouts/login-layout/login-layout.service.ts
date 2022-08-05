import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from 'app/shared/common.service';

@Injectable({
  providedIn: 'root'
})
export class LoginLayoutService {

  constructor(private commonService: CommonService, private http: HttpClient) { }


  // ============== Staff =========== //
    userLogin( loginData: any){
        return this.http.post(this.commonService.rootData.rootUrl + 'staff/staff-login', loginData)
    }
}
