import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  addCamera(camDetails: any): Observable<any>{
    console.log('camDetails____',camDetails);
    const token = sessionStorage.getItem('authorizationCode')

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log(`token_____`, token);

    return this.http.post("http://192.168.68.129:5000/add_camera", { 
      headers: headers,
      "cam_details": camDetails,
      withCredentials: true 
    });
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

    const token = sessionStorage.getItem('authorizationCode')

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get("http://192.168.68.129:5000/get_pending_reports", { 
      headers: headers,
      withCredentials: true 
    });
  }

  getPendingReportDetails(jobId: any): Observable<any>{
    const token = sessionStorage.getItem('authorizationCode')

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post("http://192.168.68.129:5000/report_details", { 
      headers: headers,
      'jobId': jobId,
      withCredentials: true 
    });
  }

  validateUser(data: any): Observable<any>{
    return this.http.post("http://192.168.68.129:5000/login", {'user_data': data,  withCredentials: true });
  }

  adminPasswordReset(data: any): Observable<any>{
    const token = sessionStorage.getItem('authorizationCode')

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log("token_____", token);
    
    console.log(`newData`, data);
    return this.http.post("http://192.168.68.129:5000/modify_admin_password", { 
      headers: headers,
      'newData': data,
      withCredentials: true 
    });
  }

  showNumberOfUsers(): Observable<any>{
    const token = sessionStorage.getItem('authorizationCode')

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get("http://192.168.68.129:5000/number_of_users", { 
      headers: headers,
      withCredentials: true 
    });

  }

  getWeeklyReport(): Observable<any>{
    const token = sessionStorage.getItem('authorizationCode')

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get("http://192.168.68.129:5000/weekly_report", { 
      headers: headers,
      withCredentials: true 
    });
  }

  getQuarterlyReport(): Observable<any>{
    const token = sessionStorage.getItem('authorizationCode')

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get("http://192.168.68.129:5000/quarterly_report", { 
      headers: headers,
      withCredentials: true 
    });
  }


  addUser(data: any): Observable<any>{
    const token = sessionStorage.getItem('authorizationCode');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    console.log(`token____`, token);

    return this.http.post(
      'http://192.168.68.129:5000/registration',
      {
        headers: headers,
        'user_data': data,
        withCredentials: true,
      }
    );

    }

  modifyAdminOperatorPassword(data: any): Observable<any>{
    const token = sessionStorage.getItem('authorizationCode')

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post("http://192.168.68.129:5000/modify_admin_opeartor_password", { 
      headers: headers,
      'modified_data': data,
      withCredentials: true 
    });

  }

  logout(employeeId: any){

    const token = sessionStorage.getItem('authorizationCode')

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });    
    console.log(`token____`, token);
    return this.http.post("http://192.168.68.129:5000/logout", { 
      headers: headers,
      withCredentials: true 
    });
  }
}
