import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  addCamera(camDetails: any){
    console.log(camDetails);
    return this.http.post("http://192.168.68.110:5000/add_camera",{"cam_details": camDetails});
  }
  searchDateTime(data: any)
  {
    // console.log('search data',data);    
    return this.http.post("http://192.168.68.110:5000/search_date_time",{"report_data": data});
  }

  searchDateTimeFull(query: any)
  {
    return this.http.post("http://192.168.68.110:5000/search_date_time_full",{"query": query});
  }

  getDataforInspection(data: any){
    console.log(data);
    return this.http.post("http://192.168.68.110:5000/vehicle_details",{"data": data});
  }

  getVehicleModels(){
    return this.http.get("http://192.168.68.110:5000/model_list");
  }
  getVehicleVariants(model: any){
    return this.http.post("http://192.168.68.110:5000/variant_list", {'model': model});
  }
  getVehicleCc(data: any){
    return this.http.post("http://192.168.68.110:5000/cc_list", {'data': data});
  }

  getPendingReportDetails(jobId: any){
    return this.http.post("http://192.168.68.110:5000/report_details", {'jobId': jobId});
  }

  validateUser(data: any){
    return this.http.post("http://192.168.68.110:5000/login", {'user_data': data});
  }

  adminPasswordReset(data: any){
    return this.http.post("http://192.168.68.110:5000/modify_admin_password", {'newData': data});
  }

  showNumberOfUsers(){
    return this.http.get("http://192.168.68.110:5000/number_of_users");
  }

  getWeeklyReport(){
    return this.http.get("http://192.168.68.110:5000/weekly_report");
  }

  getQuarterlyReport(){
    return this.http.get("http://192.168.68.110:5000/quarterly_report");
  }

  showPendingReports(){
    return this.http.get("http://192.168.68.110:5000/pending_reports");
  }

  addUser(data: any){
    return this.http.post("http://192.168.68.110:5000/registration", {'user_data': data});
  }

  modifyAdminOperatorPassword(data: any){
    return this.http.post("http://192.168.68.110:5000/modify_admin_opeartor_password", {'modified_data': data});
  }
}
