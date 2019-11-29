import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';
import {MessageService} from './message.service';
import {SherpaService} from './sherpa.service';
import { HttpErrorHandler } from './http-error-handler.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatGridListModule, MatToolbarModule, MatIconModule, MatProgressBarModule, MatSelectModule, MatListModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatGridListModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
    MatListModule,
    FormsModule,
  ],
  entryComponents: [AppComponent],
  providers: [MessageService,SherpaService,HttpErrorHandler],
  bootstrap: [],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(private injector: Injector) {
   
  }

  ngDoBootstrap() {
    const ngElement = createCustomElement(AppComponent, {
      injector: this.injector
    });
    customElements.define('sherpa-widget', ngElement);

  }
 }

