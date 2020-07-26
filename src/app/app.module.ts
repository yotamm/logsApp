import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { LogComponent } from './components/log/log.component';
import { StepComponent } from './components/progress-bar/step/step.component';
import { SanitizeAnsiDirective } from './directives/sanitize-ansi.directive';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProgressBarComponent,
    LogComponent,
    StepComponent,
    SanitizeAnsiDirective,
    ButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
