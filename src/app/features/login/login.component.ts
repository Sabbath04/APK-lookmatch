import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from '../../shared/components/loading-screen.component';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingScreenComponent, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string | null = null;
  loading: boolean = false;
  hidePassword: boolean = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
}

  // Métodos para manejar focus/blur y manipular clases de los grupos de input
  onInputFocus(group: HTMLElement, ...classes: string[]): void {
    if (group && group.classList) {
      group.classList.add(...classes);
    }
}

  onInputBlur(group: HTMLElement, ...classes: string[]): void {
    if (group && group.classList) {
      group.classList.remove(...classes);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.authService.setToken(res.token);
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Login exitoso',
            text: 'Bienvenido!',
            timer: 3000,
            showConfirmButton: false,
            background: '#111827',
            color: '#fff',
            iconColor: '#10b981',
            confirmButtonColor: '#10b981',
            customClass: {
              popup: 'shadow-2xl',
              title: 'font-bold',
              confirmButton: 'bg-[#10b981] text-white'
            }
          });
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        },
        error: (err) => {
          this.error = 'Credenciales inválidas';
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Credenciales inválidas',
            timer: 3000,
            showConfirmButton: false,
            background: '#111827',
            color: '#fff',
            iconColor: '#e53935',
            confirmButtonColor: '#e53935',
            customClass: {
              popup: 'shadow-2xl',
              title: 'font-bold',
              confirmButton: 'bg-[#e53935] text-white'
            }
          });
        }
      });
    }
  }
}
