import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private translate: TranslateService) {}

  // Charge un fichier JSON de traduction en fonction de la langue
  loadTranslation(lang: string): void {
    this.translate.use(lang);
    this.translate.setTranslation(lang, require(`../assets/i18n/${lang}.json`));
    console.log(`../assets/i18n/${lang}.json`);

    // Stocke la langue actuelle dans le localStorage
    localStorage.setItem('currentLang', lang);
  }

  // Obtient la traduction pour une clé donnée
  getTranslation(key: string): string {
    return this.translate.instant(key);
  }

  // Obtient la langue actuelle
  getCurrentLanguage(): string {
    return localStorage.getItem('currentLang') || 'en';
  }

  initializeTranslation(): void {
    // Obtient la langue stockée dans le localStorage
    const storedLang = this.getCurrentLanguage();
    this.loadTranslation(storedLang);
  }
}
