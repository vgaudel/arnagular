import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PreferenceService } from '../../../services/preference-service';

@Component({
  imports: [RouterLink],
  selector: 'app-header',
  styleUrl: './header.scss',
  templateUrl: './header.html',
})
export class Header {
  private preferenceService = inject(PreferenceService);

}
