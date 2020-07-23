import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LogComponent} from "./components/log/log.component";

const routes: Routes = [
  {path: '', component: HomeComponent, children: [{path: ':name', component: LogComponent}]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
