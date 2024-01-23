import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: any, title: any){
    this.toastr.success(message, title,{
      timeOut: 1000,
      // positionClass: 'my-toast-top-center',
      // disableTimeOut: true,
      closeButton: true,
      tapToDismiss: true,
      progressBar: true,
      easeTime: 300,
    });
  }
   
  showError(message: any, title: any){
    this.toastr.error(message, title,{
        timeOut: 3000,
        // positionClass: 'my-toast-top-center',
        // disableTimeOut: true,
        closeButton: true,
        tapToDismiss: true,
        progressBar: true,
        easeTime: 300,
      });
  }
   
  showInfo(message: any, title: any){
    this.toastr.info(message, title,{
      timeOut: 3000,
      // positionClass: 'my-toast-top-center',
      // disableTimeOut: true,
      closeButton: true,
      tapToDismiss: true,
      progressBar: true,
      easeTime: 300,
    });
  }
   
  showWarning(message: any, title: any){
    this.toastr.warning(message, title,{
      timeOut: 3000,
      // positionClass: 'my-toast-top-center',
      // disableTimeOut: true,
      closeButton: true,
      tapToDismiss: true,
      progressBar: true,
      easeTime: 300,
    });
  }

  clearToast(){
    this.toastr.clear();
  }
}
