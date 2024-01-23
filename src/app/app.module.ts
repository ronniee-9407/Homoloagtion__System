import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SuperUserComponent } from './super-user/super-user.component';
import { AdminComponent } from './admin/admin.component';
import { OperatorComponent } from './operator/operator.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from "ngx-echarts";
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SuperUserComponent,
    AdminComponent,
    OperatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    FormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'), 
    }),
    NgCircleProgressModule.forRoot({
      "radius": 60,
      "outerStrokeWidth": 10,
      "innerStrokeWidth": 5,
      "showBackground": false,
      "startFromZero": false})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
