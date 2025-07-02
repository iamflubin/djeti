import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { toast } from 'ngx-sonner';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    AuthFormComponent,
    HlmButtonDirective,
    HlmInputDirective,
    HlmLabelDirective,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = toast;

  loading = this.authService.loading;

  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  get f() {
    return this.form.controls;
  }

  onRegister() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.authService.register(this.form.getRawValue()).subscribe({
      next: async () => {
        await this.router.navigate(['auth', 'login']);
        this.toast.success('Registered successfully. You can now log in');
      },
      error: error => {
        this.toast.error(error.error.message);
      },
    });
  }
}
