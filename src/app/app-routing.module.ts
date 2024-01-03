import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent} from './login/login.component';
import { SuperUserComponent} from './super-user/super-user.component';
import { AdminComponent} from './admin/admin.component';
import { OperatorComponent} from './operator/operator.component';

const routes: Routes = [
  {path: '', redirectTo: '/admin', pathMatch: 'full'},
  {path:'login', component: LoginComponent},
  {path:'super_user', component: SuperUserComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'operator', component: OperatorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
