import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-form',
  imports: [RouterModule],
  template: `
    <div>
      <img src="img/logo.png" alt="" class="w-40" />
      <h1 class="text-3xl font-black">👋 {{ title() }}</h1>
      <p class="mb-4 mt-1 text-sm text-muted-foreground">
        {{ redirectInfo().text }}
        <a
          class="cursor-pointer underline underline-offset-4 hover:text-primary"
          [routerLink]="redirectInfo().url"
          >{{ redirectInfo().label }}</a
        >
      </p>
      <ng-content />
    </div>
  `,
  styleUrl: './auth-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {
  readonly title = input.required<string>();
  readonly redirectInfo = input.required<{
    url: string;
    text: string;
    label: string;
  }>();
}
