import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);

  let checkLoggedIn = sessionStorage.getItem('isUserLoggedIn');
  let curr_user = sessionStorage.getItem('userType');

  let url = state.url;
  console.log('url',url);
  let new_url = url.substring(1);
  
  if(checkLoggedIn != null && checkLoggedIn == 'true' && new_url == curr_user){
    return true;
  }
  else
    return router.navigate(['/login']);
};
