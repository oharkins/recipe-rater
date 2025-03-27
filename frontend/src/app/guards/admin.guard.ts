import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // This is a placeholder. In a real app, you would check if the user is an admin.
    // For now, we'll assume a user is an admin if they have an 'isAdmin' flag in localStorage
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (isAdmin) {
      return true;
    }
    
    this.router.navigate(['/']);
    return false;
  }
} 