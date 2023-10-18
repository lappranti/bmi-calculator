import { Component, OnInit } from '@angular/core';
import { TranslationService } from './translation.service';

interface BMIComment {
  min: number;
  max: number;
  comment: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  bmiRanges: BMIComment[] = [
    {
      min: 0,
      max: 18.5,
      comment: 'underweight',
    },
    {
      min: 18.6,
      max: 24.9,
      comment: 'healthy-weight',
    },
    {
      min: 25,
      max: 29.9,
      comment: 'overweight',
    },
    {
      min: 30,
      max: 100,
      comment: 'obese',
    },
  ];

  //Language
  currentLang!: string;
  menuLang: any = false;

  //Data
  selectedSystem: string = 'metric';
  weightValue!: any;
  heightValue!: any;

  weightSt!: any;
  weightLbs!: any;
  heightFt!: any;
  heightIn!: any;

  calculatedBMI!: number;
  bmiComment!: string;
  selectedRange!: BMIComment | undefined;

  constructor(private translationService: TranslationService) {}
  ngOnInit(): void {
    this.initializeBmi();
    this.currentLang = this.translationService.getCurrentLanguage() || 'en';
    this.translationService.initializeTranslation();
  }

  handleToggleMenuLang() {
    this.menuLang = !this.menuLang;

    if (this.menuLang) {
      window.addEventListener('click', this.handleOutsideClick);
    }
  }

  handleOutsideClick = (e: any) => {
    const menu = document.getElementById('menu-lang');
    const btnToggleMenu = document.getElementById('btn-toggle-menu');

    if (
      menu &&
      !menu.contains(e.target) && // Clic en dehors du menu.
      e.target != btnToggleMenu &&
      !btnToggleMenu?.contains(e.target)
    ) {
      this.menuLang = false;
      window.removeEventListener('click', this.handleOutsideClick);
    }
  };

  onChangeSystem() {
    this.heightValue = null;
    this.weightValue = null;
  }

  calculateBMI() {
    // Vérifiez que le poids et la taille sont valides et non nuls
    if (this.weightValue > 0 && this.heightValue > 0) {
      // Convertissez la taille de centimètres (cm) en mètres (m)
      const heightInM = this.heightValue / 100;

      // Appliquez la formule BMI
      this.calculatedBMI = this.weightValue / (heightInM * heightInM);
      this.calculatedBMI = this.roundToDecimal(this.calculatedBMI);

      this.selectedRange = this.bmiRanges.find(
        (range) =>
          this.calculatedBMI >= range.min && this.calculatedBMI <= range.max
      );

      if (this.selectedRange) {
        this.bmiComment = this.selectedRange.comment;
        this.calculateWeight(this.heightValue, this.selectedRange.min);
        this.calculateWeight(this.heightValue, this.selectedRange.max);
      }
    } else {
      this.initializeBmi();
    }
  }

  // Methode pour le system imperial
  ftToCm() {
    // 1 pied (ft) équivaut à environ 30.48 centimètres (cm)
    this.heightValue = this.heightFt * 30.48;
    this.calculateBMI();
  }

  inToCm() {
    // 1 pouce (inch) équivaut à environ 2.54 centimètres (cm)
    this.heightValue = this.heightIn * 2.54;
    this.calculateBMI();
  }

  stToKg() {
    // 1 stone (st) équivaut à environ 6.35 kilogrammes (kg)
    this.weightValue = this.weightSt * 6.35;
    this.calculateBMI();
  }

  lbsToKg() {
    // 1 livre (lb) équivaut à environ 0.45359237 kilogrammes (kg)
    this.weightValue = this.weightLbs * 0.45359237;
    this.calculateBMI();
  }

  roundToDecimal(val: number) {
    const factor = 10;
    return Math.round(val * factor) / factor;
  }

  calculateWeight(bmi: number, height: number) {
    const weight = bmi * ((height * height) / 10000);
    console.log('weight :' + this.roundToDecimal(weight));

    return this.roundToDecimal(weight);
  }

  initializeBmi() {
    this.calculatedBMI = 23.4;
    this.bmiComment = `healthy-weight`;
  }

  selectLang(selectedLang: string) {
    this.handleToggleMenuLang();
    if (selectedLang !== this.currentLang) {
      this.currentLang = selectedLang;
      this.translationService.loadTranslation(selectedLang);
    }
  }
}
