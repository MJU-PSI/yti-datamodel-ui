import { isDefined } from '../utils/object';
import { Language, UILanguage } from '../utils/language';
import { Show } from '../components/contracts';

const modelLanguageKey = 'modelLanguage';
const uiLanguageKey = 'UILanguage';
const showKey = 'show';
const selectionWidthKey = 'selectionWidth';
const visualizationFocus = 'visualizationFocus';
const sortAlphabetically = 'sortAlphabetically';
const showName = 'showName';

export enum FocusLevel {
  DEPTH1 = 1,
  DEPTH2 = 2,
  DEPTH3 = 3,
  INFINITE_DEPTH = 4,
  ALL = 5
}

export enum NameType {
  LABEL,
  ID,
  LOCAL_ID
}

export class SessionService {

  private get<T>(key: string): T {
    const value = window.sessionStorage.getItem(key);
    return isDefined(value) ? JSON.parse(value) : null;
  }

  private set(key: string, value: any): void {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  get UILanguage(): UILanguage {
    return this.get<UILanguage>(uiLanguageKey);
  }

  set UILanguage(lang: UILanguage) {
    this.set(uiLanguageKey, lang);
  }

  get modelLanguage(): {[entityId: string]: Language} {
    return this.get<{[entityId: string]: Language}>(modelLanguageKey);
  }

  set modelLanguage(lang: {[entityId: string]: Language}) {
    this.set(modelLanguageKey, lang);
  }

  get show(): Show {
    return this.get<Show>(showKey);
  }

  set show(value: Show) {
    this.set(showKey, value);
  }

  get selectionWidth(): number {
    return this.get<number>(selectionWidthKey);
  }

  set selectionWidth(value: number) {
    this.set(selectionWidthKey, value);
  }

  get visualizationFocus(): FocusLevel {
    return this.get<FocusLevel>(visualizationFocus);
  }

  set visualizationFocus(value: FocusLevel) {
    this.set(visualizationFocus, value);
  }

  get sortAlphabetically(): boolean {
    return this.get<boolean>(sortAlphabetically);
  }

  set sortAlphabetically(value: boolean) {
    this.set(sortAlphabetically, value);
  }

  get showName(): NameType {
    return this.get<NameType>(showName);
  }

  set showName(value: NameType) {
    this.set(showName, value);
  }
}
