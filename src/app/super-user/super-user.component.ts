import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/services/backend.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as echarts from 'echarts';
import { NotificationService } from 'src/services/notification.service';

@Component({
  selector: 'app-super-user',
  templateUrl: './super-user.component.html',
  styleUrls: ['./super-user.component.scss'],
})
export class SuperUserComponent implements OnInit {
  currentString: any;

  dashboardFlag: boolean = true;
  addUser: boolean = false;
  addCam: boolean = false;
  report: boolean = false;

  add_delete_operator_flag: boolean = true

  toogleOptionsAddDel: boolean = true

  constructor(
    private service: BackendService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private notifyService: NotificationService
  ) {}

  ngOnInit(): void {
    setTimeout(()=> {
      this.createChart();
    },10)
  }

  myChart1: any;

  createChart() {
    this.myChart1 = echarts.init(document.getElementById('graph_area1') as any);

    const option1 = {
      title: {
        text: '',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Current Week', 'Last Week'],
        textStyle: {
          color: 'white',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Current Week',
          type: 'line',
          smooth: true,
          stack: 'Total',
          data: [120, 132, 101],
        },
        {
          name: 'Last Week',
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: [220, 182, 191, 234, 290, 330, 310],
        },
      ],
    };
    this.myChart1.setOption(option1);
  }

  //! Function to fecth and store the data for the cam details
  submitCamDetails() {
    console.log('Submit cam details clicked.');
  }

  changeOptions(data: any) {
    if (data == 'home') {
      this.dashboardFlag = true;
      this.addUser = false;
      this.addCam = false;
      this.report = false;
      setTimeout(()=>{
        this.createChart()
      },10)
    } else if (data == 'add_del') {
      this.dashboardFlag = false;
      this.addUser = true;
      this.addCam = false;
      this.report = false;
    } else if (data == 'cam_details') {
      this.dashboardFlag = false;
      this.addUser = false;
      this.addCam = true;
      this.report = false;
    } else if (data == 'report') {
      this.dashboardFlag = false;
      this.addUser = false;
      this.addCam = false;
      this.report = true;
    }
  }

  //! Function to control the route
  logout(){
    this.router.navigate(['/login']);
  }

  //! Funciton to create the new Admin
  createNewAdmin(userType: any){
    let name = <HTMLInputElement> document.getElementById('name');
    let nameValue = name.value;
    let userId = <HTMLInputElement> document.getElementById('name2');
    let userIdValue = userId.value;
    let pass = <HTMLInputElement> document.getElementById('password1');
    let password = pass.value;
    let cnfPass = <HTMLInputElement> document.getElementById('password2');
    let cnfPassword = cnfPass.value;
    console.log("create new Admin clicked.");
    if(password === cnfPassword){
      let data = {
        'name': nameValue,
        'employee_id': userIdValue,
        'password': password,
        'user_type': userType
      }
      this.service.addUser(data).subscribe((data: any)=>{
        console.log('Add user data',data);
      })
    }
    else{
      this.notifyService.showError('Password and coonfirm password not matched','Notification');
    }
    
  }



  //! Function to edit the Admin
  editAdmin(){
    console.log("edit Admin clicked.");
  }

  //! Toggle Options for operator and admin
  toogleOptions(){
    console.log("Toggle Options");
    this.toogleOptionsAddDel = !this.toogleOptionsAddDel
    this.add_delete_operator_flag = !this.add_delete_operator_flag
  }
}
