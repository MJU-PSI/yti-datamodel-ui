import { AbstractControl } from '@angular/forms';

declare module '@angular/forms' {
  interface AbstractControl {
    editing: boolean;
    pendingEdit?: boolean;
  }
}
