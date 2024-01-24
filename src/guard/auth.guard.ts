import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);

  let checkLoggedIn = localStorage.getItem('isUserLoggedIn');
  let curr_user = localStorage.getItem('userType');

  let url = state.url;
  let new_url = url.substring(1);
  
  if(checkLoggedIn != null && checkLoggedIn == 'true' && new_url == curr_user){
    return true;
  }
  else
    return router.navigate(['/login']);
};
