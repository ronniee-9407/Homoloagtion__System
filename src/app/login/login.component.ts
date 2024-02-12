import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/services/backend.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NotificationService } from 'src/services/notification.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  constructor(private service: BackendService, private sanitizer: DomSanitizer, private router: Router, private notifyService: NotificationService){
  }

  ngOnInit(): void {
    
  }

  flag_admin_page: boolean = false
  flag_su_page: boolean = true
  flag_operator_page: boolean = false
  curr_user: any = 'super_user';
  viewPassword = [false, false, false];
  login_clicked: boolean = false;




  changeAccessControl(data: any){
    if (data==="op"){
      this.curr_user = 'operator';
      this.flag_admin_page= false
      this.flag_su_page= false
      this.flag_operator_page= true
    } else if(data==="admin"){
      this.curr_user = 'admin';
      this.flag_admin_page= true
      this.flag_su_page= false
      this.flag_operator_page= false
    } else if(data==="su"){
      this.curr_user = 'super_user';
      this.flag_admin_page= false
      this.flag_su_page= true
      this.flag_operator_page= false
    }
    this.viewPassword = [false, false, false];
  }


  login(data: any){
    let idValue = <HTMLInputElement> document.getElementById('name');
    let userId = idValue.value;
    let pass = <HTMLInputElement> document.getElementById('password');
    let password = pass.value;
    if(userId == '' || password == ''){
      this.notifyService.showWarning('Input fiels cannot be empty','Notification');
      return;
    }
    this.login_clicked  = true;
    let user_data = {
      'employee_id' : userId,
      'password' : password,
      'user_type' : this.curr_user
    };
    this.service.validateUser(user_data).subscribe((data: any)=>{
      let login_status = data['status'];
      let name = data['name'];
      this.login_clicked = false;
      if(login_status){
        sessionStorage.setItem('isUserLoggedIn', 'true');
        sessionStorage.setItem('userType', this.curr_user);
        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('authorizationCode', data['access_token']);
        this.router.navigate([this.curr_user]);
      }
      else{
        this.notifyService.showError('Incorrect login Credentials','Error')
      }
    },
    (error: any) => {
      this.login_clicked = false;
      this.notifyService.showError('Please check your Server', 'Server Connection Error');
    });
  }

  showPassword(index: any){
    this.viewPassword[index] = true;
    let currId = <HTMLInputElement>document.getElementById("password");
    currId.type = 'text';
  }
  hidePassword(index: any){
    this.viewPassword[index] = false;
    let currId = <HTMLInputElement>document.getElementById("password");
    currId.type = 'password';
  }
}
