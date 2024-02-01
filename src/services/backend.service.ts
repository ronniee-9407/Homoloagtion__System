import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  addCamera(camDetails: any): Observable<any>{
    console.log(camDetails);
    return this.http.post("http://192.168.68.129:5000/add_camera",{"cam_details": camDetails, withCredentials: true});
  }
  searchDateTime(data: any): Observable<any>
  {
    // console.log('search data',data);    
    return this.http.post("http://192.168.68.129:5000/search_date_time",{"report_data": data});
  }

  searchDateTimeFull(query: any): Observable<any>
  {
    return this.http.post("http://192.168.68.129:5000/search_date_time_full",{"query": query});
  }

  getDataforInspection(data: any): Observable<any>{
    console.log(data);
    return this.http.post("http://192.168.68.129:5000/vehicle_details",{"data": data});
  }

  getVehicleModels(): Observable<any>{
    return this.http.get("http://192.168.68.129:5000/model_list");
  }
  getVehicleVariants(model: any): Observable<any>{
    return this.http.post("http://192.168.68.129:5000/variant_list", {'model': model});
  }
  getVehicleCc(data: any){
    return this.http.post("http://192.168.68.129:5000/cc_list", {'data': data});
  }

  getPendingReport(employeeId: any){
    return this.http.get("http://192.168.68.129:5000/get_pending_reports?userId=" + employeeId);
  }

  getPendingReportDetails(jobId: any): Observable<any>{
    return this.http.post("http://192.168.68.129:5000/report_details", {'jobId': jobId});
  }

  validateUser(data: any): Observable<any>{
    console.log('login data',data);
    return this.http.post("http://192.168.68.129:5000/login", {'user_data': data,  withCredentials: true });
  }

  adminPasswordReset(data: any): Observable<any>{
    return this.http.post("http://192.168.68.129:5000/modify_admin_password", {'newData': data});
  }

  showNumberOfUsers(): Observable<any>{
    return this.http.get("http://192.168.68.129:5000/number_of_users");
  }

  getWeeklyReport(): Observable<any>{
    return this.http.get("http://192.168.68.129:5000/weekly_report");
  }

  getQuarterlyReport(): Observable<any>{

    return this.http.get("http://192.168.68.129:5000/quarterly_report", { withCredentials: true });
  }


  addUser(data: any): Observable<any>{
    return this.http.post("http://192.168.68.129:5000/registration", {'user_data': data});
  }

  modifyAdminOperatorPassword(data: any): Observable<any>{
    return this.http.post("http://192.168.68.129:5000/modify_admin_opeartor_password", {'modified_data': data});
  }

  logout(employeeId: any){
    return this.http.post("http://192.168.68.129:5000/logout", {'employeeId': employeeId});
  }
}
