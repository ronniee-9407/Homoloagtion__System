import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/services/backend.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.scss']
})
export class OperatorComponent implements OnInit {

  operator_view_list = ['Dashboard', 'select_vehicle', 'live_feed', 'report_submit', 'reInspect_landing'];
  feature_logo_list = ['home.png'];
  curr_operator_view = this.operator_view_list[0];
  model_selected: boolean = false;
  variant_selected: boolean = false;
  cc_selected: boolean = false;
  model_list = ['Activa', 'Dio', 'Grazia'];
  variant_list = ['BS-IV', 'BS-VI'];
  cc_list = ['110', '125'];
  inspection_model: any = '';
  inspection_variant: any = '';
  inspection_cc: any = '';
  reInspectFlag: boolean = false;
  abortFlag: boolean = false;
  camFeed: any;
  noVideo: boolean = true;
  // inputList = ['K01ID1', 'K0YID2', 'WINGS'];
  inputList = [];

  id_array = ['20028740', 'FP28E-001A', 'K0YD01'];
  status_array = ['O', 'O', 'O'];

  inspection_count = 0;
  inspection_percentage = 66;

  constructor(private service: BackendService, private sanitizer: DomSanitizer, private router: Router){}

  ngOnInit(): void {
    
  }

  newInspection(){
    this.curr_operator_view = this.operator_view_list[1];
    this.service.getVehicleModels().subscribe((data: any)=>{
      // this.curr_operator_view = this.operator_view_list[1];
      this.model_list = data['model_list'];
    });
  }

  reInspectionOld(){
    this.curr_operator_view = this.operator_view_list[4];
  }

  modelSelection(){
    this.model_selected = true;
    let model = this.inspection_model;
    this.service.getVehicleVariants(model).subscribe((data: any)=>{
      // this.model_selected = true;
      this.variant_list = data['variant_list'];
    });
  }
  variantSelection(){
    this.variant_selected = true;
    let data = {
      'model': this.inspection_model,
      'variant': this.inspection_variant
    }
    console.log(data);
    this.service.getVehicleCc(data).subscribe((data: any)=>{
      // this.variant_selected = true;
      this.cc_list = data['cc_list'];
    });   
  }
  ccSelection(){
    this.cc_selected = true;
  }

  startInspection(){
    // console.log('Vehicle details for inspection',this.inspection_model, this.inspection_variant, this.inspection_cc);
    let vehicle_info = {
      'model': this.inspection_model,
      'variant': this.inspection_variant,
      'cc': this.inspection_cc
    }
    this.curr_operator_view = this.operator_view_list[2];
    this.service.getDataforInspection(vehicle_info).subscribe((data: any)=>{
      console.log('Got data for inspection', data);
      this.curr_operator_view = this.operator_view_list[2];
      this.liveFeed();
    });
    
  }

liveFeed(){
  let videoFeed = "ws://127.0.0.1:8000/camFeed";
  let socketVideo = webSocket(videoFeed);
  let ipVideo = socketVideo.subscribe((data: any)=>{
    console.log('Websocket data', data);
    let videoUrl = 'data:image/jpg;base64,' + data['image'];
    this.camFeed = this.sanitizer.bypassSecurityTrustUrl(videoUrl);
    this.noVideo = data['noVideo'];
  });
}

  reInspectToggle(){
    this.reInspectFlag = true;
  }

  abortToggle(){
    this.abortFlag = true;
  }

  reInspect(flag: any){
    if(!flag){
      this.reInspectFlag = false;
    }
    else{
      this.reInspectFlag = false;
      this.curr_operator_view = this.operator_view_list[2];
    }
  }
  abort(flag: any){
    if(!flag){
      this.abortFlag = false;
    }
    else{
      this.abortFlag = false;
      this.curr_operator_view = this.operator_view_list[0];
      this.inspection_model = '';
      this.inspection_variant = '';
      this.inspection_cc = '';
      this.model_selected = false;
      this.variant_selected = false;
    }
  }
  checkValue(data: any){
    
  }
  goToDashboard(){
    this.curr_operator_view = this.operator_view_list[0];
  }

  logout(){
    localStorage.removeItem('isUserLoggedIn');
    localStorage.removeItem('userType');
    this.router.navigate(['/login']);
  }
}
