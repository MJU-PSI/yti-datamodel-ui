import { InjectionToken } from '@angular/core';
import { InteractiveHelp } from 'app/help/contract';

export interface HelpProvider {
  helps: InteractiveHelp[];
}

export const HELP_PROVIDER = new InjectionToken<HelpProvider>('HelpService');
