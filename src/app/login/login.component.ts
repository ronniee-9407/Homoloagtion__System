import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/services/backend.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  constructor(private service: BackendService, private sanitizer: DomSanitizer, private router: Router){}

  ngOnInit(): void {
    
  }

  flag_admin_page: boolean = false
  flag_su_page: boolean = true
  flag_operator_page: boolean = false
  curr_user: any = 'super_user';
  viewPassword = [false, false, false];



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
    // console.log('CurrentUser', this.curr_user);
  }


  login(data: any){
    let idValue = <HTMLInputElement> document.getElementById('name');
    let userId = idValue.value;
    let pass = <HTMLInputElement> document.getElementById('password');
    let password = pass.value;
    console.log('UserId :', userId);
    console.log('Password :', password);
    console.log('CurrentUser', this.curr_user);
    let user_data = {
      'userId' : userId,
      'password' : password,
      'curr_user' : this.curr_user
    };
    this.service.validateUser(user_data).subscribe((data: any)=>{
      let login_status = data['login_status'];
      if(login_status){
        this.router.navigate([this.curr_user]);
      }
      else{

      }
    });
    this.router.navigate([this.curr_user]);
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
