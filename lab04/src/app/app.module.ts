import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { BikeComponent } from './bike/bike.component'
import { BikeListComponent } from './bike-list/bike-list.component'
import { BikeService } from './bike.service'

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent, BikeComponent, BikeListComponent ],
  bootstrap:    [ AppComponent ],
  providers: [BikeService]
})
export class AppModule { }


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/