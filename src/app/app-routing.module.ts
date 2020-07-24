import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LogComponent} from "./components/log/log.component";

const routes: Routes = [
  {path: 'build', component: HomeComponent, children: [{path: ':stepId', component: LogComponent}]},
  { path: '**', redirectTo: 'build/0' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
