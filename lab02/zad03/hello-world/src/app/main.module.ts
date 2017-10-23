import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HelloComponent } from './hello.component';
import { StudentComponent } from './student/student.component';

@NgModule({
  declarations: [
    HelloComponent,
    StudentComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [HelloComponent]
})
export class MainModule { }
