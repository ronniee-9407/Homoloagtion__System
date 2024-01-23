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
  rtspLink: string = '';
  camDetails = {
    userId: '',
    password: '',
    camIP: '',
    port: '',
    rtsp: ''
  };

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
    this.getDashboardData();
  }

  getDashboardData(){
    this.service.showNumberOfUsers().subscribe((data: any)=>{
      console.log('Get number of users', data); 
    });
    this.service.getWeeklyReport().subscribe((data: any)=>{
      console.log('Get weekly report', data); 
    });
    this.service.getQuarterlyReport().subscribe((data: any)=>{
      console.log('Get quarterly report', data); 
    })

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
    let id = <HTMLInputElement>document.getElementById("userId");
    let idValue = id.value;
    let pass = <HTMLInputElement>document.getElementById("password");
    let passValue = pass.value;
    let ip = <HTMLInputElement>document.getElementById("ip");
    let ipValue = ip.value;
    let port = <HTMLInputElement>document.getElementById("port");
    let portValue = port.value;
    if(idValue == '' || passValue == '' || ipValue == ''){
      this.notifyService.showWarning('Please fill all the fields','Notification');
      return;
    }
    this.camDetails.userId = idValue;
    this.camDetails.password = passValue;
    this.camDetails.camIP = ipValue;
    this.camDetails.port = portValue;
    this.camDetails.rtsp = this.rtspLink;
    // console.log('sending cam details',this.camDetails);
    this.service.addCamera(this.camDetails).subscribe((data: any)=>{
      console.log('got data for addCam',data);
      // if(data){
      //   this.addCameraToggle = false;
      // }
    })
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
  editAdmin(userType: any){
    console.log("edit Admin clicked.");
    let id = <HTMLInputElement>document.getElementById("employeeId");
    let employee_id = id.value;
    let newPass = <HTMLInputElement>document.getElementById("newPassword");
    let new_password = newPass.value;
    let cnfPass = <HTMLInputElement>document.getElementById("cnfPass");
    let cnf_password = cnfPass.value;

    if(employee_id == '' || new_password == '' || cnf_password == ''){
      this.notifyService.showWarning('Input fields cannot be empty','Notification');
      return;
    }
    else{
      if(new_password === cnf_password){
        let newData = {
          'employee_id': employee_id,
          'new_password': new_password,
          'cnf_password': cnf_password,
          'user_type': userType
        }
        this.service.modifyAdminOperatorPassword(newData).subscribe((data: any)=>{
          console.log('Modify admin operator password', data);
        });
      }
      else{
        this.notifyService.showError('New password and Confirm password not matched','Notification');
      }
    }
  }

  //! Toggle Options for operator and admin
  toogleOptions(){
    console.log("Toggle Options");
    this.toogleOptionsAddDel = !this.toogleOptionsAddDel
    this.add_delete_operator_flag = !this.add_delete_operator_flag
  }

  generateRTSP(){
    let id = <HTMLInputElement>document.getElementById("userId");
    let idValue = id.value;
    let pass = <HTMLInputElement>document.getElementById("password");
    let passValue = pass.value;
    let ip = <HTMLInputElement>document.getElementById("ip");
    let ipValue = ip.value;
    let port = <HTMLInputElement>document.getElementById("port");
    let portValue = port.value;
    // this.rtspLink = 'rtsp://' + idValue + ':' + passValue + '@' + ipValue + ':' + portValue + '/?h264x=4';
    this.rtspLink = 'rtsp://' + idValue + ':' + passValue + '@' + ipValue + ':' + portValue + '/cam/realmonitor?channel=1&subtype=0';
    console.log('this.rtspLink',this.rtspLink);
  }
}
