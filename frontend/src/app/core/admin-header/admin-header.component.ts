import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/services/api-service.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  constructor(private apiService: ApiServiceService, private router: Router, private http: HttpClient) { }
  users:any;
  leaveArray:any[]=[];
  counter = 0

  ngOnInit(): void {
    const admin = localStorage.getItem('admin');
    if (admin == null) {
      this.router.navigateByUrl('/adminlogin', { replaceUrl: true })
    }
    else {
      this.http.get(`${this.apiService.url}/users`).subscribe(res => {
        this.users = res;
        this.users.map((a: any) => {
          this.leaveArray.push(a.leaves)
        });
        [res].map((a:any)=>{
          a.map((b:any)=>{
            b.leaves.map((c:any)=>{
              if(c.status=="Pending"){
                this.counter++
              }
            })
          })
        })
        // this.originalServiceProvider = res;
      },
        error => {
          console.log(error)
        })
    }

    this.apiService.getNotifications.subscribe((noti:any) => {
      if(noti.toLowerCase()==="denied" || noti.toLowerCase()==="approved"){
        this.counter--
      }
      this.users.map((a:any)=>{
        a.map((b:any)=>{
          b.leaves.map((c:any)=>{
            if(c.status=="Pending"){
              this.counter++
            }
          })
        })
      })
    })
  
  }

  adminLogout(){
    this.apiService.adminLogout();
  }


}
