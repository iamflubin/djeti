import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [JsonPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly user = inject(AuthService).user;
}
