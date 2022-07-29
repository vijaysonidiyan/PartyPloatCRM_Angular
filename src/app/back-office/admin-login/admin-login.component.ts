import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }
  login() {
    debugger
    let loginObj = {
      c_Email: 'ajaypatel@yopmail.com',
      pwd: 'India@123'
  };
    this.http.post("http://122.170.0.3:6010/v1/adminside/login", loginObj).subscribe(
      (Response: any) => {
        this.router.navigate(['admin/dashboard']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
