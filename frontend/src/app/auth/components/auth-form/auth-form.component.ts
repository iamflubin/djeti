import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-form',
  imports: [RouterModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
  readonly title = input.required<string>();
  readonly redirectInfo = input.required<{
    url: string;
    text: string;
    label: string;
  }>();
}
