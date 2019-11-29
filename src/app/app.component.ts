import {
  Component,
  Input,
  OnChanges,
  ViewEncapsulation,
} from "@angular/core";
import { SherpaService } from "./sherpa.service";

export interface Countries {
  countries: Array<Object>;
  localization: Object;
}

export interface Results {
  currency: Object;
  passport: Object;
  vaccination: Object;
  visa: Array<Object>;
}
export interface EntryRequirement {
  citizenship: String;
  destination: String;
  language: String;
  affiliateId: String;
}

export interface Requirement {
  affiliateId: String;
  defaultNationalityCountry: String;
  finalAirportName: String;
  language: String;
  currency: String;
  itinerary: Array<Object>;
  travellers: Array<Object>;
}

@Component({
  selector: "custom-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.sass"],
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnChanges {
  @Input() content: String;

  requirement: Requirement;
  results: Results[] = [];
  countries: Countries;
  loading = false;
  destination: String;
  selectedCountry: String;
  alpha_2: Object = {};
  previousLanguage: String;
  sameCountry: Boolean;
  defaultCountry: Array<Object>;
  column1: Number;
  column2: Number;
  row: String;
  row1: Number;

  constructor(public sherpaService: SherpaService) {
    this.row = "30px";
  }

  ngOnChanges(changes): void {
    this.column1 = window.innerWidth <= 900 ? 4 : 1;
    this.column2 = window.innerWidth <= 900 ? 4 : 4 - Number(this.column1);
    this.row1 = this.column1 === 4 ? 6 : 8;

    const newRequirement: Requirement = JSON.parse(
      changes.content.currentValue
    );

    if (Object.keys(this.alpha_2).length !== 0) {
      this.defaultCountry = this.countries.countries.filter(country => {
        if (country["alpha_2"] === newRequirement.defaultNationalityCountry) {
          this.selectedCountry = country["name"];
          return true;
        }
      });
    }

    this.requirement = newRequirement;

    this.getCountries(newRequirement.language);
    this.destination = this.requirement.finalAirportName;
    this.getSherpaData();
    this.setrow();
  }

  setrow() {
    if (this.requirement.itinerary.length === 1) {
      this.row = "30px";
    } else if (this.requirement.itinerary.length === 2) {
      this.row = "40px";
    }
    if (this.requirement.itinerary.length === 3) {
      this.row = "60px";
    }
    if (this.row === "60px" && this.column1 === 4) {
      this.row1 = 4;
    }
  }

  setCountryChanged() {
    this.requirement.defaultNationalityCountry = this.alpha_2[
      `${this.selectedCountry}`
    ];
    this.sameCountry = false;
    this.getSherpaData();
  }

  getCountries(lang) {
    if (
      Object.keys(this.alpha_2).length === 0 ||
      this.previousLanguage !== lang
    ) {
      this.previousLanguage = lang;
      this.sherpaService
        .getCountries(this.requirement.language)
        .subscribe((countries: Countries) => {
          this.countries = countries;
          countries.countries.forEach((country, i) => {
            this.alpha_2[country["name"]] = country["alpha_2"];
            if (
              country["alpha_2"] === this.requirement.defaultNationalityCountry
            ) {
              this.selectedCountry = country["name"];
            }
          });
          countries.localization["visaRequirementsFor"] = countries.localization["visaRequirementsFor"].replace('{{destination}}',this.requirement.finalAirportName);
        });
    }
  }

  onResize(event) {
    this.column1 = event.target.innerWidth <= 900 ? 4 : 1;
    this.column2 =
      event.target.innerWidth <= 900 ? 4 : 4 - Number(this.column1);
    this.row1 = event.target.innerWidth <= 900 ? 6 : 8;
  }

  getSherpaData() {
    this.loading = false;
    this.sameCountry = false;
    this.results = [];
    if (this.requirement.itinerary) {
      this.requirement.itinerary.forEach(destination => {
        const params: EntryRequirement = {
          citizenship: this.requirement.defaultNationalityCountry,
          destination: destination["destinationCountry"],
          language: this.requirement.language
            ? this.requirement.language
            : "en",
          affiliateId: this.requirement.affiliateId
        };

        if (
          this.requirement.defaultNationalityCountry ===
          destination["destinationCountry"] &&
          this.requirement.itinerary.length <= 1
        ) {
          this.sameCountry = true;
        } else {
          this.getEntryRequirement(params);
        }
      });
    }
  }

  getEntryRequirement(params) {
    this.sherpaService
      .getEntryRequirements(params)
      .subscribe((data: Results) => {
        console.log('i got the data')
        this.loading = false;
        this.results.push(data);
       
      });
  }
}
