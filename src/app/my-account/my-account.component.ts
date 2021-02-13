import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import csc from 'country-state-city';
import { Account } from '../models/account.model';
import { Contact } from '../models/contact.model';
import { getCurrentUser, UserState } from '../modules/auth/state/user.reducer';
import { GomangoUser } from '../modules/auth/user.model';
import { DataService } from '../services/data.service';
import { UpdateAccount } from '../state/app.actions';
import { AppState, getAccount } from '../state/app.reducer';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  nameValidationRegex: any;
  phoneValidationRegex: any;
  emailValidationRegex: any;
  passwordValidationRegex: any;
  personal: FormGroup;
  personalInfoEditable = false;
  emailchange: FormGroup;
  emailEditable = false;
  mobileNoChange: FormGroup;
  mobileEditable = false;
  passwordChange: FormGroup;
  addressForm: FormGroup;
  passwordMatched = true;
  currentTab = 1;
  countryList = [];
  stateList = [];
  cityList = [];
  currentCountryCode = '';
  currentStateCode = '';
  currentCityCode = '';
  account: Account;
  contact: Contact[];
  user: GomangoUser;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private store: Store<AppState>,
    private authstore: Store<UserState>,
    private userStore: Store<UserState>
  ) {
    this.nameValidationRegex = this.dataService.nameValidationRegex;
    this.phoneValidationRegex = this.dataService.phoneValidationRegex;
    this.passwordValidationRegex = this.dataService.passwordValidationRegex;

    this.personal = this.fb.group({
      // tslint:disable-next-line:max-line-length
      orgName: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.minLength(2)]),
      // tslint:disable-next-line:max-line-length
      // lastName: new FormControl(null , [Validators.required, Validators.maxLength(100), Validators.minLength(2), Validators.pattern(this.nameValidationRegex)])
    });
    this.personal.disable();

    this.mobileNoChange = this.fb.group({
      // tslint:disable-next-line:max-line-length
      phone: new FormControl(null, [Validators.required, Validators.maxLength(15), Validators.minLength(8), Validators.pattern(this.phoneValidationRegex)]),
    });
    this.mobileNoChange.disable();

    this.passwordChange = this.fb.group({
      // tslint:disable-next-line:max-line-length
      currentpassword: new FormControl(null, [Validators.required]),
      newpassword: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.pattern(this.passwordValidationRegex)]),
      confpassword: new FormControl(null, [Validators.required]),
    });

    this.addressForm = this.fb.group({
      street: new FormControl(null, [Validators.required]),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl('', [Validators.required]),
      pincode: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.userStore.select(getCurrentUser).pipe().subscribe(user => {
      this.user = user;
    });

    this.currentCountryCode = 'CA';
    this.addressForm.patchValue({
      country: this.currentCountryCode
    });
    this.countryList = csc.getAllCountries();
    // console.log('this.countryList: ', this.countryList);
    this.populateStateList(this.currentCountryCode);
    this.authstore.select(getCurrentUser).pipe().subscribe((user) => {
      this.user = user.user;
    });
    this.store.select(getAccount).pipe().subscribe((account) => {
      this.account = {...account};
      this.account.id = this.user.identity.id;
      if (!this.account.contact) {
        this.account.contact = [];
      }
      if (!this.account.contact.length) {
        this.account.contact = [new Contact()];
      }
      this.personal.patchValue({
        orgName: this.account.orgName ?? ''
      });
      this.mobileNoChange.patchValue({
        phone: this.account.contact[0].phone ?? ''
      });
      this.addressForm.patchValue({
        street: this.account.contact[0].street ?? '',
        state: this.account.contact[0].state ?? '',
        city: this.account.contact[0].city ?? '',
        pincode: this.account.contact[0].zip ?? ''
      });
    });
  }

  populateStateList(countryCode): void {
    this.stateList = csc.getStatesOfCountry(countryCode);
    // console.log('this.stateList: ', this.stateList);
    if (this.stateList.length !== 0) {
      this.currentStateCode = this.stateList[0].isoCode;
      this.addressForm.patchValue({
        state: this.currentStateCode
      });
      this.populateCityListByState(countryCode, this.currentStateCode);
    } else {
      this.populateCityListByCountry(countryCode);
    }
  }

  populateCityListByState(countryCode, stateCode): void {
    this.cityList = csc.getCitiesOfState(countryCode, stateCode);
    // console.log('populateCityListByState this.cityList: ', this.cityList);
    if (this.cityList.length !== 0) {
      this.currentCityCode = this.cityList[0].name;
      this.addressForm.patchValue({
        city: this.currentCityCode
      });
    }
  }

  populateCityListByCountry(countryCode): void {
    this.cityList = csc.getCitiesOfCountry(countryCode);
    // console.log('populateCityListByCountry this.cityList: ', this.cityList);
    if (this.cityList.length !== 0) {
      this.currentCityCode = this.cityList[0].name;
      this.addressForm.patchValue({
        city: this.currentCityCode
      });
    }
  }

  changeCountry(event): void {
    this.currentCountryCode = event.target.value;
    this.populateStateList(this.currentCountryCode);
  }

  changeState(event): void {
    this.currentStateCode = event.target.value;
    this.populateCityListByState(this.currentCountryCode, this.currentStateCode);
  }

  async savePersonalInfo(): Promise<void> {
    if (this.personal.valid) {
      this.account.orgName = this.personal.value.orgName;
      this.store.dispatch(new UpdateAccount(this.account));
    } else {
      this.dataService.showError('Please fill require details'); // --- Display error message
      Object.keys(this.personal.controls).forEach((field) => {
        const control = this.personal.get(field);
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      });
    }
  }

  // async saveEmail(): Promise<void> {
  //   if (this.emailchange.valid) {
  //     // const payload = {
  //     //   email: this.emailchange.value.email,
  //     // };
  //     // console.log('saveEmail payload: ', payload);
  //   } else {
  //     this.dataService.showError('Please fill require details'); // --- Display error message
  //     Object.keys(this.emailchange.controls).forEach((field) => {
  //       const control = this.emailchange.get(field);
  //       control.markAsTouched({ onlySelf: true });
  //       control.markAsDirty({ onlySelf: true });
  //     });
  //   }
  // }

  async saveMobileNo(): Promise<void> {
    if (this.mobileNoChange.valid) {
      this.account.contact[0].phone = this.mobileNoChange.value.phone;
      this.store.dispatch(new UpdateAccount(this.account));
    } else {
      this.dataService.showError('Please fill require details'); // --- Display error message
      Object.keys(this.mobileNoChange.controls).forEach((field) => {
        const control = this.mobileNoChange.get(field);
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      });
    }
  }

  checkConfPassword(event): void {
    const confPasssword = event.target.value;
    // console.log('confPasssword: ', confPasssword);
    // tslint:disable-next-line:max-line-length
    if (confPasssword.length !== 0 && confPasssword !== this.passwordChange.value.newpassword) {
      this.passwordMatched = false;
    } else {
      this.passwordMatched = true;
    }
  }

  async changePassword(): Promise<void> {
    if (this.passwordChange.valid && this.passwordMatched) {
      const payload = {
        currentpassword: this.passwordChange.value.currentpassword,
        newpassword: this.passwordChange.value.newpassword,
      };
      console.log('changePassword payload: ', payload);
    } else {
      this.dataService.showError('Please fill require details'); // --- Display error message
      Object.keys(this.passwordChange.controls).forEach((field) => {
        const control = this.passwordChange.get(field);
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      });
    }
  }

  async saveAddress(): Promise<void> {
    if (this.addressForm.valid) {
      this.account = {...this.account};
      const contact = new Contact();
      contact.city = this.addressForm.value.city;
      contact.country = this.addressForm.value.country;
      contact.state = this.addressForm.value.state,
      contact.zip = this.addressForm.value.pincode;
      contact.street = this.addressForm.value.street;
      this.account.contact = [contact];
      this.store.dispatch( new UpdateAccount(this.account));
      console.log('saveAddress payload: ', this.account);
    } else {
      this.dataService.showError('Please fill require details'); // --- Display error message
      Object.keys(this.addressForm.controls).forEach((field) => {
        const control = this.addressForm.get(field);
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      });
    }
  }

}
