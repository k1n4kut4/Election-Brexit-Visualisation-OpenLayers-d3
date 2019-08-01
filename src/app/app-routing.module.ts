import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { D3mapComponent } from './d3map/d3map.component';

const routes: Routes = [
  { path: '', component: D3mapComponent },
  { path: 'map', component: D3mapComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
