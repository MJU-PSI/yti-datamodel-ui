import { LanguageContext, UILanguage, Language, Localizer as AngularJSLocalizer } from 'app/types/language';
import { translate } from 'app/utils/language';
import { Localizable, Localizer as AngularLocalizer, availableLanguages, defaultLanguage, getFromLocalStorage, setToLocalStorage } from '@mju-psi/yti-common-ui';
import { SessionService } from './sessionService';
import { TranslateService } from '@ngx-translate/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { gettextCatalog as GettextCatalog } from 'angular-gettext';

type Localizer = AngularJSLocalizer;
export { Localizer };

export class LanguageService {
  private static readonly LANGUAGE_KEY: string = 'yti-datamodel-ui.language-service.language';
  private static readonly CONTENT_LANGUAGE_KEY: string = 'yti-datamodel-ui.language-service.content-language';

  private _modelLanguage: {[entityId: string]: Language} = {};

  availableLanguages: any;
  defaultLanguage: any;
  availableUILanguages: Language[];

  language$: BehaviorSubject<Language>;
  contentLanguage$: BehaviorSubject<Language>;
  translateLanguage$: BehaviorSubject<Language>;

  constructor(private gettextCatalog: GettextCatalog /* AngularJS */,
              private translateService: TranslateService /* Angular */,
              public localizationStrings: { [key: string]: { [key: string]: string } },
              private sessionService: SessionService) {
    'ngInject';
    this.availableLanguages = availableLanguages;
    this.defaultLanguage = defaultLanguage || 'en';
    this.availableUILanguages = availableLanguages.map((lang: { code: any; }) => { return lang.code });

    this.language$ = new BehaviorSubject<Language>(getFromLocalStorage(LanguageService.LANGUAGE_KEY, this.defaultLanguage));
    this.contentLanguage$ = new BehaviorSubject<Language>(getFromLocalStorage(LanguageService.CONTENT_LANGUAGE_KEY, this.defaultLanguage));
    this.translateLanguage$ = new BehaviorSubject<Language>(this.defaultLanguage);

    translateService.addLangs(this.availableLanguages.map((lang: { code: any; }) => { return lang.code }));
    translateService.setDefaultLang(this.defaultLanguage);

    gettextCatalog.baseLanguage = this.defaultLanguage;

    this.language$.subscribe(lang => {
      this.translateService.use(lang);
      this.gettextCatalog.setCurrentLanguage(lang);
    });

    this._modelLanguage = sessionService.modelLanguage || {};

    combineLatest(this.language$, this.contentLanguage$)
      .subscribe(([lang, contentLang]) => this.translateLanguage$.next(lang || contentLang));
  }

  get UILanguage(): string {
    return this.language$.getValue();
  }

  set UILanguage(language: UILanguage) {
    if (this.UILanguage !== language) {
      this.language$.next(language);
      setToLocalStorage(LanguageService.LANGUAGE_KEY, language);
    }
  }

  getModelLanguage(context?: LanguageContext): string {
    const getUILanguageOrFirst = () => {
      if (context!.language.indexOf(this.UILanguage) !== -1) {
        return this.UILanguage;
      } else {
        return context!.language[0];
      }
    };

    if (context) {
      const key = context.id.uri;
      const language = this._modelLanguage[key];
      return language ? language : getUILanguageOrFirst();
    } else {
      return this.UILanguage;
    }
  }

  setModelLanguage(context: LanguageContext, language: Language) {
    this._modelLanguage[context.id.uri] = language;
    this.sessionService.modelLanguage = this._modelLanguage;

    this.translateLanguage$.next(language);
    setToLocalStorage(LanguageService.CONTENT_LANGUAGE_KEY, language);
  }

  translate(data: Localizable, context?: LanguageContext): string {
    return translate(data, this.getModelLanguage(context), context ? context.language : this.availableUILanguages);
  }

  translateToGivenLanguage(localizable: Localizable, languageToUse: string|null): string {

    if (!localizable || !languageToUse) {
      return '';
    }

    const primaryLocalization = localizable[languageToUse];

    if (primaryLocalization) {
      return primaryLocalization;
    } else {

      const fallbackValue = this.checkForFallbackLanguages(localizable);

      if (fallbackValue != null) {
        return fallbackValue;
      }

      for (const [language, value] of Object.entries(localizable)) {
        if (value) {
          return `${value} (${language})`;
        }
      }

      return '';
    }
  }

  checkForFallbackLanguages(localizable: Localizable): string | null {

    const fallbackLanguages: string[] = availableLanguages.map((lang: { code: any; }) => { return lang.code });

    for (const language of fallbackLanguages) {
      if (this.hasLocalizationForLanguage(localizable, language)) {
        return this.fallbackLocalization(localizable, language);
      }
    }

    return null;
  }

  hasLocalizationForLanguage(localizable: Localizable, language: string) {
    const value: string = localizable[language];
    return value != null && value !== '';
  }

  fallbackLocalization(localizable: Localizable, language: string) {
    const value: string = localizable[language];
    return `${value} (${language})`;
  }

  createLocalizer(context?: LanguageContext) {
    return new DefaultAngularJSLocalizer(this, context);
  }

  findLocalization(language: Language, key: string) {
    const stringsForLang = this.localizationStrings[language];
    return stringsForLang ? stringsForLang[key] : null;
  }
}

export class DefaultAngularLocalizer implements AngularLocalizer {

  translateLanguage$: Observable<Language>;

  constructor(private languageService: LanguageService) {
    this.translateLanguage$ = languageService.language$.asObservable();
  }

  translate(localizable: Localizable, useUILanguage?: boolean): string {
    // FIXME datamodel ui doesn't have concept of ui language boolean but language context
    return this.languageService.translate(localizable);
  }

  translateToGivenLanguage(localizable: Localizable, languageToUse: string|null): string {
    return this.languageService.translateToGivenLanguage(localizable, languageToUse);
  }
}

export class DefaultAngularJSLocalizer implements AngularJSLocalizer {

  availableUILanguages: string[];

  constructor(private languageService: LanguageService, public context?: LanguageContext) {
    this.availableUILanguages = availableLanguages.map((lang: { code: any; }) => { return lang.code });
  }

  get language(): Language {
    return this.languageService.getModelLanguage(this.context);
  }

  translate(data: Localizable): string {
    return this.languageService.translate(data, this.context);
  }

  getStringWithModelLanguageOrDefault(key: string, defaultLanguage: UILanguage): string {

    const askedLocalization = this.languageService.findLocalization(this.language, key);
    if (askedLocalization) {
      return askedLocalization;
    } else {
      const defaultLocalization = this.languageService.findLocalization(defaultLanguage, key);

      if (!defaultLocalization) {
        console.log(`Localization (${key}) not found for default language (${defaultLanguage})`);
        return '??? ' + key;
      } else {
        return defaultLocalization;
      }
    }
  }

  allUILocalizationsForKey(localizationKey: string): string[] {

    const result: string[] = [];

    for (const lang of this.availableUILanguages) {
      const localization = this.languageService.localizationStrings[lang][localizationKey];

      if (localization) {
        result.push(localization);
      }
    }

    return result;
  }
}
