import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { LogComponent } from './components/log/log.component';
import { StepComponent } from './components/progress-bar/step/step.component';
import { SanitizeAnsiDirective } from './directives/sanitize-ansi.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProgressBarComponent,
    LogComponent,
    StepComponent,
    SanitizeAnsiDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
