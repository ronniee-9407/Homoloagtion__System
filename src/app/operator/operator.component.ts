import { Component, OnInit } from '@angular/core';
import { BackendService } from 'src/services/backend.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

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
  inspection_model: any;
  inspection_variant: any;
  inspection_cc: any;
  reInspectFlag: boolean = false;
  abortFlag: boolean = false;

  id_array = ['20028740', 'FP28E-001A', 'K0YD01'];
  status_array = ['O', 'O', 'O'];

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
      // this.curr_operator_view = this.operator_view_list[2];
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
  }
  abort(flag: any){
    if(!flag){
      this.abortFlag = false;
    }
  }
  checkValue(data: any){
    
  }

  logout(){

  }
}
