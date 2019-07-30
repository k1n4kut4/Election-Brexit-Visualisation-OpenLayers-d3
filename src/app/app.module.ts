import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { D3mapComponent } from './d3map/d3map.component';

import { MatButtonModule,
         MatTableModule,
         MatFormFieldModule,
         MatInputModule,
         MatCardModule, 
         MatSelectModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    D3mapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule, 
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
