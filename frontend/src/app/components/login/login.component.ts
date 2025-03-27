import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error: string = '';
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // If user is already logged in, redirect to home
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.error = error.message || 'Login failed. Please try again.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
} 