import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs/operators';


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

  // validateUser(data: any): Observable<HttpResponse<any>> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  //   // Use observe: 'response' to get the full response including headers
  //   return this.http.post(
  //     "http://192.168.68.129:5000/login",
  //     {'user_data': data},
  //     { headers, observe: 'response', withCredentials: true }
  //   )
  //   .pipe(
  //     // Assuming the CSRF token is set in the 'XSRF-TOKEN' cookie
  //     tap((response: HttpResponse<any>) => {
  //       console.log('Reached the tap function');  // Debugging line
  //       const csrfToken = response.headers.get('XSRF-TOKEN');
  //       if (csrfToken) {
  //         // Print the CSRF token to the console
  //         console.log('The token', csrfToken);
  //         // You can store the CSRF token in a cookie if needed
  //         // this.cookieService.set('XSRF-TOKEN', csrfToken);
  //       }
  //     })
  //   );
  // }

  adminPasswordReset(data: any): Observable<any>{
    return this.http.post("http://192.168.68.129:5000/modify_admin_password", {'newData': data});
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
    return this.http.post("http://192.168.68.129:5000/registration", {'user_data': data});
  }

  modifyAdminOperatorPassword(data: any): Observable<any>{
    return this.http.post("http://192.168.68.129:5000/modify_admin_opeartor_password", {'modified_data': data});
  }

  logout(employeeId: any){

    const token = sessionStorage.getItem('authorizationCode')

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });    

    return this.http.post("http://192.168.68.129:5000/logout", { 
      headers: headers,
      'employeeId': employeeId,
      withCredentials: true 
    });
  }

  searchByJobId(jobID: any): Observable<any>{
    return this.http.post("http://192.168.68.129:5000/search_jobId", {'jobID': jobID});
  }
}
