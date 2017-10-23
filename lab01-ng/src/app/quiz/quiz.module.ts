import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizComponent } from './quiz.component';
import { QuizBoardComponent } from './quiz-board/quiz-board.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    QuizComponent
  ],
  declarations: [
    QuizComponent,
    QuizBoardComponent
  ]
})
export class QuizModule { }
