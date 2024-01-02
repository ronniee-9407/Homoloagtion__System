import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  addCamera(camDetails: any){
    console.log(camDetails);
    return this.http.post("http://127.0.0.1:9000/add_camera",{"camDetails": camDetails});
  }
  searchDateTime(query: any, page: any, per_page: any)
  {
    console.log(query);    
    return this.http.post("http://127.0.0.1:8000/searchDateTime",{"query": query, "page": page, "per_page": per_page});
  }

  searchDateTimeFull(query: any)
  {
    return this.http.post("http://127.0.0.1:8000/searchDateTimeFull",{"query": query});
  }
}
