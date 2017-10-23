import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {QuizModule} from './quiz/quiz.module';
import {QuizBoardComponent} from './quiz/quiz-board/quiz-board.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    QuizModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
