import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/services/backend.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Litepicker from 'litepicker';
import * as echarts from 'echarts';
import { NotificationService } from 'src/services/notification.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  admin_view_list = [
    'Dashboard',
    'Pending Report',
    'Report Analysis',
    'Camera',
    'Profile',
  ];
  feature_logo_list = [
    'home.png',
    'checklist.png',
    'report.png',
    'video.png',
    'user.png',
  ];
  curr_admin_view = this.admin_view_list[0];
  // pending_report_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  pending_report_list: any[] = [];
  pending_report_list_details: any[] = [];
  report_page_flag: boolean = false;
  inspection_report_flag: boolean = false;
  report_page_flag_detail: boolean = false;
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
  };
  userDetails = {
    name: 'Admin',
    userId: '',
    designation: '',
  };
  startDate: any;
  endDate: any;
  startTime = '00:00';
  endTime = '23:59';
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
  view_profiile: boolean = false;

  success_checkpoints: any = 84;
  failed_checkpoints: any = 16;

  myChart: any;
  xAxisData = [
    '25-12-2023',
    '26-12-2023',
    '27-12-2023',
    '28-12-2023',
    '29-12-2023',
    '30-12-2023',
    '31-12-2023',
  ];
  yAxisData = [5, 8, 7, 5, 9, 6, 4];

  passwordView = [false, false, false];
  part_image_list = [];
  previewFlag: boolean = false;
  curr_view_image: any;

  constructor(
      private service: BackendService, 
      private sanitizer: DomSanitizer, 
      private router: Router, 
      private notifyService: NotificationService, 
      private cookieService: CookieService
    ){}

  ngOnInit(): void {
    this.userDetails.userId = String(sessionStorage.getItem('userId'));
    this.userDetails.name = String(sessionStorage.getItem('name'));
    let userType = String(sessionStorage.getItem('userType'));
    this.userDetails.designation =
      userType.charAt(0).toUpperCase() + userType.slice(1);
    setTimeout(() => {
      this.createChart(this.xAxisData, this.yAxisData);
    }, 10);
    this.getDashboardData();
  }
  generatePendingReportList(numParts: number, numSubparts: number): any[] {
    const pendingReportList: any[] = [];

    for (let i = 1; i <= numParts; i++) {
      const part = {
        name: 'Part ' + i,
        checked: false,
        subparts: [] as { id: string; name: string; checked: boolean; status: string }[]
      };

      for (let j = 1; j <= numSubparts; j++) {
        part.subparts.push({
          id: 'sub_part_' + j,
          name: 'Sub-Part ' + j,
          checked: false,
          status: 'True'
        });
      }

      pendingReportList.push(part);
    }

    return pendingReportList;
  }
  getDashboardData(){
    this.service.getWeeklyReport().subscribe((data: any)=>{
      console.log('Get weekly report', data); 
    },
    (error: any) => {
      this.notifyService.showError('Please check your Server', 'Server Connection Error');
    });

    this.service.getQuarterlyReport().subscribe(
      (data: any) => {
        // this.cookieService.set('session', 'cookie_value');
        console.log('Get quarterly report', data);
      },
      (error: any) => {
        this.notifyService.showError(
          'Please check your Server',
          'Server Connection Error'
        );
      }
    );

    this.service.getPendingReport(this.userDetails.userId).subscribe(
      (data: any) => {
        // console.log('Pending reports', data['result'][0]['pending_reports'][0]['admin_id']);
        this.pending_report_list = data['result'];
        console.log('data',this.pending_report_list);
      },
      (error: any) => {
        this.notifyService.showError(
          'Please check your Server',
          'Server Connection Error'
        );
      }
    );
  }

  changeView(index: any) {
    this.curr_admin_view = this.admin_view_list[index];
    if (index == 2) {
      setTimeout(() => this.initializingDatePicker(), 0);
    }
    if (index == 0) {
      this.getDashboardData();
      setTimeout(() => {
        this.createChart(this.xAxisData, this.yAxisData);
      }, 100);
    }
    if (index == 1) {
      this.service.getPendingReport(this.userDetails.userId).subscribe(
        (data: any) => {
          this.pending_report_list = data['result'];
          console.log('data',data);
          // console.log('data',this.pending_report_list);
        },
        (error: any) => {
          this.notifyService.showError(
            'Please check your Server',
            'Server Connection Error'
          );
        }
      );
    }
  }
  goToSearchReport() {
    this.report_page_flag = false;
    this.report_page_flag_detail = false;
    setTimeout(() => this.initializingDatePicker(), 0);
  }
  goToSearchReportDashboard(){
    this.report_page_flag = false;
    this.report_page_flag_detail = false;
    setTimeout(() => this.initializingDatePicker(), 0);
  }

  logout() {
    try {
      this.service.logout(this.userDetails.userId).subscribe(
        (data: any) => {
          // console.log('Logged out', data);
          sessionStorage.removeItem('isUserLoggedIn');
          sessionStorage.removeItem('userType');
          sessionStorage.removeItem('userId');
          sessionStorage.removeItem('name');
          sessionStorage.removeItem('authorizationCode');
          this.router.navigate(['/login']);
          this.notifyService.showInfo(
            'Logged out successfully',
            'Notification'
          );
        },
        (error: any) => {
          this.notifyService.showError(
            'Please check your Server',
            'Server Connection Error'
          );
        }
      );
    } catch (error) {
      console.log(`Print_error`, error);
    }
  }

  addCam() {
    let id = <HTMLInputElement>document.getElementById('user');
    let idValue = id.value;
    let pass = <HTMLInputElement>document.getElementById('pass');
    let passValue = pass.value;
    let ip = <HTMLInputElement>document.getElementById('ip');
    let ipValue = ip.value;
    let port = <HTMLInputElement>document.getElementById('port');
    let portValue = port.value;
    if (idValue == '' || passValue == '' || ipValue == '') {
      this.notifyService.showWarning(
        'Please fill all the fields',
        'Notification'
      );
      return;
    }
    this.camDetails.userId = idValue;
    this.camDetails.password = passValue;
    this.camDetails.camIP = ipValue;
    this.camDetails.port = portValue;
    // console.log('sending cam details',this.camDetails);
    this.service.addCamera(this.camDetails).subscribe(
      (data: any) => {
        console.log('got data for addCam', data);
        if (data['status']) {
          this.notifyService.showSuccess(
            'Camera added successfully',
            'Notification'
          );
          id.value = '';
          pass.value = '';
          ip.value = '';
        } else {
          this.notifyService.showError(
            'Invalid Camera credentials',
            'Notification'
          );
        }
      },
      (error: any) => {
        this.notifyService.showError(
          'Please check your Server',
          'Server Connection Error'
        );
      }
    );
  }

  initializingDatePicker() {
    const startDateElement = document.getElementById(
      'start-date'
    ) as HTMLInputElement;
    const endDateElement = document.getElementById(
      'end-date'
    ) as HTMLInputElement;
    if (startDateElement && endDateElement) {
      this.picker = new Litepicker({
        element: startDateElement,
        elementEnd: endDateElement,
        singleMode: false,
        allowRepick: true,
        dropdowns: { minYear: 2020, maxYear: null, months: true, years: true },
      });
    } else {
      console.log('Litepicker not initialised........');
    }
  }

  searchDateTime() {
    let tempStartDate = document.getElementById(
      'start-date'
    ) as HTMLInputElement;
    let tempEndDate = document.getElementById('end-date') as HTMLInputElement;
    let tempStartTime = document.getElementById(
      'start-time'
    ) as HTMLInputElement;
    let tempEndTime = document.getElementById('end-time') as HTMLInputElement;
    this.startDate = tempStartDate.value;
    this.endDate = tempEndDate.value;
    this.startTime = tempStartTime.value;
    this.endTime = tempEndTime.value;
    if (this.startDate == '' && this.endDate == '') {
      this.notifyService.showInfo('Select Date First!', 'Notification');
      return;
    }
    let stDate = this.startDate + ' ' + this.startTime;
    let edDate = this.endDate + ' ' + this.endTime;
    let searchData = {
      start_date: stDate,
      end_date: edDate,
      query_page: this.queryPage,
      per_page: this.per_page,
    };

    let fullData = {
      start_date: stDate,
      end_date: edDate,
    };

    this.report_page_flag = true;
    this.service.searchDateTime(searchData).subscribe(
      (data: any) => {
        // this.data_received = false;
        // this.dataFromDb = data['tableData'];
        console.log('data for report',data);
      },
      (error: any) => {
        this.notifyService.showError(
          'Please check your Server',
          'Server Connection Error'
        );
        return;
      }
    );
    this.service.searchDateTime(fullData).subscribe(
      (data: any) => {
        // this.totalDBData = data['dbdata'];
        // this.totalDBDataCount = data['totalCount'];
        console.log('Total DB data', data)
      },
      (error: any) => {
        this.notifyService.showError(
          'Please check your Server',
          'Server Connection Error'
        );
        return;
      }
    );
  }

  clickNext() {
    this.queryPage++;
    let stDate = this.startDate + ' ' + this.startTime;
    let edDate = this.endDate + ' ' + this.endTime;
    // let query = [stDate, edDate];
    let searchData = {
      start_date: stDate,
      end_date: edDate,
      query_page: this.queryPage,
      per_page: this.per_page,
    };
    this.service.searchDateTime(searchData).subscribe(
      (data: any) => {
        this.dataFromDb = data['tableData'];
        this.lenOfArray = this.dataFromDb[0][0];
      },
      (error: any) => {
        this.notifyService.showError(
          'Please check your Server',
          'Server Connection Error'
        );
        return;
      }
    );

    if (this.queryPage * this.per_page > this.totalDBDataCount) {
      this.nextAvailable = false;
    }
    this.previousAvailable = true;
  }

  clickPrevious() {
    this.queryPage--;
    let stDate = this.startDate + ' ' + this.startTime;
    let edDate = this.endDate + ' ' + this.endTime;
    // let query = [stDate, edDate];
    let searchData = {
      start_date: stDate,
      end_date: edDate,
      query_page: this.queryPage,
      per_page: this.per_page,
    };
    this.service.searchDateTime(searchData).subscribe(
      (data: any) => {
        this.dataFromDb = data['tableData'];
        this.lenOfArray = this.dataFromDb[0][0];
      },
      (error: any) => {
        this.notifyService.showError(
          'Please check your Server',
          'Server Connection Error'
        );
        return;
      }
    );

    if (this.queryPage == 1) this.previousAvailable = false;

    if (this.queryPage * this.per_page < this.totalDBDataCount) {
      this.nextAvailable = true;
    }
  }

  goToPendingReport() {
    this.curr_admin_view = this.admin_view_list[1];
    this.inspection_report_flag = false;
    this.approval_flag = false;
    this.reject_flag = false;
    this.service.getPendingReport(this.userDetails.userId).subscribe(
      (data: any) => {
        this.pending_report_list = data['result'];
        console.log('data',this.pending_report_list);
      },
      (error: any) => {
        this.notifyService.showError(
          'Please check your Server',
          'Server Connection Error'
        );
      }
    );
  }
  approveToggle(data: any) {
    // console.log('index for approval...',data);
    this.approval_flag = true;
    this.index_for_approve_reject = data;
  }
  rejectToggle(data: any) {
    // console.log('index for rejection...',data);
    this.reject_flag = true;
    this.index_for_approve_reject = data;
  }

  reportApproved(data: any) {
    if (!data) {
      this.approval_flag = false;
    } else {
      // console.log('Report Approved');
      this.approval_flag = false;
    }
  }
  reportRejected(data: any) {
    if (!data) {
      this.reject_flag = false;
    } else {
      // console.log('Report Rejected');
      this.reject_flag = false;
    }
  }

  viewReport(data: any) {
        this.success_checkpoints = data['success'];
        this.failed_checkpoints = data['failed'];
        this.inspection_report_flag = true;
        this.createPieChart(this.success_checkpoints, this.failed_checkpoints);
    // let jobId = 12345;
    // this.service.getPendingReportDetails(jobId).subscribe(
    //   (data: any) => {
    //     console.log('data',data);
        
    //     this.success_checkpoints = data['success'];
    //     this.failed_checkpoints = data['failed'];
    //     this.inspection_report_flag = true;
    //     this.createPieChart(this.success_checkpoints, this.failed_checkpoints);
    //   },
    //   (error: any) => {
    //     this.notifyService.showError(
    //       'Please check your Server',
    //       'Server Connection Error'
    //     );
    //     return;
    //   }
    // );
    // this.inspection_report_flag = true;
    // setTimeout(() => {
    //   this.createPieChart(this.success_checkpoints, this.failed_checkpoints);
    // }, 10);
  }
  viewReportFromdashboard() {
    let jobId = 12345;
    this.service.getPendingReportDetails(jobId).subscribe(
      (data: any) => {
        console.log('data',data);
        this.success_checkpoints = data['success'];
        this.failed_checkpoints = data['failed'];
        this.inspection_report_flag = true;
        this.curr_admin_view = this.admin_view_list[1];
        this.createPieChart(this.success_checkpoints, this.failed_checkpoints);
      },
      (error: any) => {
        this.notifyService.showError(
          'Please check your Server',
          'Server Connection Error'
        );
        return;
      }
    );
    // this.inspection_report_flag = true;
    // this.curr_admin_view = this.admin_view_list[1];
    // setTimeout(() => {
    //   this.createPieChart(this.success_checkpoints, this.failed_checkpoints);
    // }, 10);
  }

  createPieChart(xData: any, yData: any) {
    let myChart2 = echarts.init(
      document.getElementById('chart2') as HTMLDivElement
    );
    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        // top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'No. of Checkpoints',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 10,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: xData, name: 'Success', itemStyle: { color: '#1bf372' } },
            { value: yData, name: 'Failed', itemStyle: { color: '#ff4545' } },
          ],
        },
      ],
    };
    myChart2.setOption(option);
  }

  createChart(xData: any, yData: any) {
    const maxValue = Math.max(...yData);
    this.myChart = echarts.init(document.getElementById('chart1') as any);
    const option_1 = {
      color: ['#70b3e2 '],
      tooltip: {
        trigger: 'axis',
        showContent: true,
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#ccc',
          },
        },
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          dataView: { show: true, readOnly: false },
          // magicType: {show: true, type: ["bar", "line"]},
          saveAsImage: { show: true },
        },
      },
      grid: {
        top: '25%',
        bottom: '15%',
        left: '15%',
      },
      xAxis: {
        name: 'Date',
        nameLocation: 'middle',
        nameGap: 38,
        type: 'category',
        boundaryGap: true,
        data: xData,
        axisPointer: {
          type: 'shadow',
        },
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 14,
          color: 'black',
          padding: [20, 0, 0, 0],
          verticalAlign: 'bottom',
        },
        // position: 'bottom'
      },
      yAxis: {
        type: 'value',
        name: 'Inspected Vehicle',
        nameGap: 35,
        max: Math.floor(maxValue + 1),
        axisLabel: {
          formatter: '{value}',
        },
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 14,
          color: 'black',
        },
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
              { type: 'min', name: 'Min' },
            ],
          },
        },
      ],
    };
    this.myChart.setOption(option_1);
  }

  changePassword() {
    let oldPass = <HTMLInputElement>document.getElementById('name');
    let oldPassValue = oldPass.value;
    let newPass = <HTMLInputElement>document.getElementById('password');
    let newPassValue = newPass.value;
    let cnfPass = <HTMLInputElement>document.getElementById('password2');
    let cnfPassValue = cnfPass.value;
    if (oldPassValue == '' || newPassValue == '' || cnfPassValue == '') {
      this.notifyService.showWarning('Input fields cannot be empty', 'Warning');
      return;
    }

    if (newPassValue === cnfPassValue) {
      let data = {
        oldPassword: oldPassValue,
        newPassword: newPassValue,
        userId: this.userDetails.userId,
      };
      // console.log('new data',data);
      this.service.adminPasswordReset(data).subscribe(
        (data: any) => {
          console.log('Data', data);
          if (data['status']) {
            this.notifyService.showSuccess(
              'Password changed successfully',
              'Notification'
            );
            oldPass.value = '';
            newPass.value = '';
            cnfPass.value = '';
          } else {
            this.notifyService.showError(
              'Old password did not matched',
              'Notification'
            );
          }
        },
        (error: any) => {
          this.notifyService.showError(
            'Please check your Server',
            'Server Connection Error'
          );
        }
      );
    } else {
      this.notifyService.showWarning(
        'New password and Confirm password does not match',
        'Notification'
      );
    }
  }

  viewPassword(id: any, index: any) {
    this.passwordView[index] = true;
    let currId = <HTMLInputElement>document.getElementById(id);
    currId.type = 'text';
  }

  closePassword(id: any, index: any) {
    this.passwordView[index] = false;
    let currId = <HTMLInputElement>document.getElementById(id);
    currId.type = 'password';
  }

  toggleSubParts(partIndex: number) {
    const part = this.pending_report_list[partIndex];
    part.checked = !part.checked;
    part.subparts.forEach((subpart: any) => subpart.checked = part.checked);
  }
  submitPendingReport() {
    const checkedSubparts: any[] = [];

    this.pending_report_list.forEach(part => {
      part.subparts.forEach((subpart: any) => {
        if (subpart.checked) {
          checkedSubparts.push({
            partName: part.name,
            subpart
          });
        }
      });
    });
    console.log('Checked Subparts:', checkedSubparts);
  }
    
  searchByJobId(){
    let jobId = <HTMLInputElement> document.getElementById('jobID');
    let idValue = jobId.value;
    if(idValue === ''){
      this.notifyService.showInfo('Please enter JobID','Notification');
      return;
    }
    this.service.searchByJobId(idValue).subscribe((data: any)=>{
      // this.decode_image(data['entries']);
      this.pending_report_list_details = data['entries'];
      console.log('pending_report_list_details',this.pending_report_list_details);

      if(data['status']){
        this.report_page_flag = false;
        this.report_page_flag_detail = true;
        jobId.value = '';
      }
      else{
        this.notifyService.showInfo('JOB ID not found','Notification');
      }
    },
    (error: any)=>{
      this.notifyService.showError('Please check your Server', 'Server Connection Error');
    });
  }

  decode_image(data: any){
    let occurrenceMap = new Map();

    data.forEach((item: any) => {
        let vehiclePart = item.vehicle_part;
        if (occurrenceMap.has(vehiclePart)) {
            occurrenceMap.set(vehiclePart, occurrenceMap.get(vehiclePart) + 1);
        } else {
            occurrenceMap.set(vehiclePart, 1);
        }
    });

    console.log(occurrenceMap);
  }

  view_image(img: any){
    this.previewFlag = true;
    let videoUrl = 'data:image/jpg;base64,' + img;
    let new_img = this.sanitizer.bypassSecurityTrustUrl(videoUrl);
    this.curr_view_image = new_img;
    console.log(this.curr_view_image);
  }
}
