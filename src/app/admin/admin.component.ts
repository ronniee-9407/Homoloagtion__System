import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/services/backend.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Litepicker from 'litepicker';
import * as echarts from 'echarts';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  admin_view_list = ['Dashboard', 'Pending Report', 'Report Analysis', 'Camera'];
  feature_logo_list = ['home.png', 'checklist.png', 'report.png', 'video.png'];
  curr_admin_view = this.admin_view_list[0];
  pending_report_list = [1, 2, 3, 4, 5, 6, 7, 8];
  report_page_flag : boolean = false;
  inspection_report_flag : boolean = false;
  approval_flag: boolean = false;
  reject_flag: boolean = false;
  index_for_approve_reject: any = 0;
  rtspLink = '';
  camAdded: boolean = false;
  camDetails = {
    userId: '',
    password: '',
    camIP: '',
    port: '',
    rtsp: ''
  };
  startDate: any;
  endDate: any;
  startTime = "00:00";
  endTime = "23:59";
  picker: Litepicker | undefined;

  dataFromDb: any = [];
  errorData: boolean = true;
  errorSlab: boolean = true;
  tableLoader: boolean = false;
  previousAvailable = false;
  nextAvailable = false;
  queryPage = 1;
  totalDBDataCount: number = 0;
  per_page = 10;
  totalDBData: any = [];
  lenOfArray = [];
  dataForExcel: any;
  array_for_chart: any = [];
  data_received: boolean = true;

  myChart: any;
  xAxisData = ['26-12-2023', '27-12-2023', '28-12-2023', '29-12-2023', '30-12-2023'];
  yAxisData = [8, 7, 5, 9, 6];

  constructor(private service: BackendService, private sanitizer: DomSanitizer, private router: Router){}

  ngOnInit(): void {
    setTimeout(()=>{
      this.createChart(this.xAxisData, this.yAxisData)
      console.log('createChart called');
    },100);
  }

  changeView(index: any){
    this.curr_admin_view = this.admin_view_list[index];
    if(index == 2){
      setTimeout(() => this.initializingDatePicker(), 0);
    }
    if(index == 0){
      setTimeout(()=>{
        this.createChart(this.xAxisData, this.yAxisData)
        console.log('createChart called');
      },100);
    }
  }

  logout(){
    
  }

  generateRTSP(){
    let id = <HTMLInputElement>document.getElementById("user");
    let idValue = id.value;
    let pass = <HTMLInputElement>document.getElementById("pass");
    let passValue = pass.value;
    let ip = <HTMLInputElement>document.getElementById("ip");
    let ipValue = ip.value;
    let port = <HTMLInputElement>document.getElementById("port");
    let portValue = port.value;
    // this.rtspLink = 'rtsp://' + idValue + ':' + passValue + '@' + ipValue + ':' + portValue + '/?h264x=4';
    this.rtspLink = 'rtsp://' + idValue + ':' + passValue + '@' + ipValue + ':' + portValue + '/cam/realmonitor?channel=1&subtype=0';
  }

  addCam(){
    let id = <HTMLInputElement>document.getElementById("user");
    let idValue = id.value;
    let pass = <HTMLInputElement>document.getElementById("pass");
    let passValue = pass.value;
    let ip = <HTMLInputElement>document.getElementById("ip");
    let ipValue = ip.value;
    let port = <HTMLInputElement>document.getElementById("port");
    let portValue = port.value;
    if(idValue == '' || passValue == '' || ipValue == ''){
      alert('Please fill all the fields');
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

  initializingDatePicker() {
    const startDateElement = document.getElementById('start-date') as HTMLInputElement;
    const endDateElement = document.getElementById('end-date') as HTMLInputElement;
    if (startDateElement && endDateElement) {
      this.picker = new Litepicker({
        element: startDateElement,
        elementEnd: endDateElement,
        singleMode: false,
        allowRepick: true,
        dropdowns: { "minYear": 2020, "maxYear": null, "months": true, "years": true }
      });
    } 
    else{
      console.log('Litepicker not initialised........');
    }
  }

  searchDateTime() {
    let tempStartDate = document.getElementById("start-date") as HTMLInputElement;
    let tempEndDate = document.getElementById("end-date") as HTMLInputElement;
    let tempStartTime = document.getElementById("start-time") as HTMLInputElement;
    let tempEndTime = document.getElementById("end-time") as HTMLInputElement;
    this.startDate = tempStartDate.value;
    this.endDate = tempEndDate.value;
    this.startTime = tempStartTime.value;
    this.endTime = tempEndTime.value;
    // if (this.startDate == "" && this.endDate == "") {
    //   console.log('select date first............');
    //   this.notifyService.showInfo("Select Date First!", "Notification");
    //   return;
    // }
    let stDate = this.startDate +" "+ this.startTime;
    let edDate = this.endDate +" "+ this.endTime;
    let query = [stDate, edDate];
    // this.tableLoader = true;
    console.log('searched date-time is',query);
    
    this.report_page_flag = true;
    this.service.searchDateTime(query, this.queryPage, this.per_page).subscribe((data: any)=>{
      // this.curr_admin_view = this.admin_view_list[5];
      this.data_received = false;
      this.dataFromDb = data['tableData'];
      if(this.dataFromDb.length == 0){
        this.errorData = true;
      }
      else{
        this.errorData = false;
      }
      this.service.searchDateTimeFull(query).subscribe((data: any) => {
        // console.log('Total data called............', data);
        this.totalDBData = data['dbdata'];
        this.totalDBDataCount = data['totalCount'];
        this.data_received = true;
        if (this.queryPage * this.per_page < this.totalDBDataCount) {
          this.nextAvailable = true;
        }
        console.log('Total DB data', this.totalDBDataCount)
      });
    });
  }

  goToPendingReport(){
    this.curr_admin_view = this.admin_view_list[1];
    this.inspection_report_flag = false;
    this.approval_flag = false;
    this.reject_flag = false;
  }
  approveToggle(data: any){
    console.log('index for approval...',data);
    this.approval_flag = true;
    this.index_for_approve_reject = data;
  }
  rejectToggle(data: any){
    console.log('index for rejection...',data);
    this.reject_flag = true;
    this.index_for_approve_reject = data;
  }

  reportApproved(data: any){
    if(!data){
      this.approval_flag = false;
    }
    else{
      console.log('Report Approved');
      this.approval_flag = false;
    }
  }
  reportRejected(data: any){
    if(!data){
      this.reject_flag = false;
    }
    else{
      console.log('Report Rejected');
      this.reject_flag = false;
    }
  }

  viewReport(data: any){
    console.log('Data for preview', data);
    this.inspection_report_flag = true;
  }
  viewReportFromdashboard(){
    this.curr_admin_view = this.admin_view_list[1];
    this.inspection_report_flag = true;
  }

  createChart(xData: any, yData: any){
    const maxValue = Math.max(...yData);
    this.myChart = echarts.init(document.getElementById('chart1') as any);
    const option_1 = {
    color: [ '#70b3e2 '],
    tooltip: {
      trigger: 'axis',
      showContent: true,
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#ccc",
        },
      }
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        dataView: {show: true, readOnly: false},
        // magicType: {show: true, type: ["bar", "line"]},
        saveAsImage: {show: true},
      }
    },
    grid: {
      top: '25%',
      bottom: '15%',
      left: '15%'
    },
    xAxis: {
      name: 'Date',
      nameLocation: 'middle',
      nameGap: 38,
      type: 'category',
      boundaryGap: true,
      data: xData,
      axisPointer: {
        type: "shadow",
      },
      nameTextStyle: { 
        fontWeight: 'bold',
        fontSize: 14, 
        color: 'black' ,
        padding: [20,0,0,0],
        verticalAlign: 'bottom'
      },
      // position: 'bottom'
    },
    yAxis: {
      type: 'value',
      name: "Inspected Vehicle",
      nameGap: 35,
      max: Math.floor(maxValue + 1),
      axisLabel: {
        formatter: '{value}'
      },
      nameTextStyle: { 
        fontWeight: 'bold',
        fontSize: 14, 
        color: 'black' 
      }
    },
    series: [
      {
        // name: 'Top',
        type: 'bar',
        data: yData,
        emphasis: { focus: 'series' },
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
      },
    ]
    }
  
    this.myChart.setOption(option_1);
  }
}
