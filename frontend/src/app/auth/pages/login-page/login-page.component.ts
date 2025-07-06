import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { toast } from 'ngx-sonner';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    AuthFormComponent,
    ReactiveFormsModule,
    HlmButtonDirective,
    HlmInputDirective,
    HlmLabelDirective,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toast = toast;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = this.authService.loading;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get f() {
    return this.form.controls;
  }

  onLogin() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.authService.login(this.form.getRawValue()).subscribe({
      next: async () => {
        await this.redirectUserOnLogin();
        this.toast.success('Logged in successfully');
      },
      error: error => {
        this.toast.error(error.error.message);
      },
    });
  }

  private async redirectUserOnLogin() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) {
      return this.router.navigateByUrl(decodeURIComponent(returnUrl));
    }
    return this.router.navigate(['']);
  }
}
