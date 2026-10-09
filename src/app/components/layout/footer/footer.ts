import { Component, inject } from '@angular/core';
import { PreferenceService } from '../../../services/preference-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-footer',
  styleUrl: './footer.scss',
  templateUrl: './footer.html',
})
export class Footer {

  private preferenceService = inject(PreferenceService)
}
