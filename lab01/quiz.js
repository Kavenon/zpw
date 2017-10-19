'use strict';

function shuffle(array){
    return array.sort(function() {
        return .5 - Math.random();
    });
}

class Quiz {

    constructor(container){

        this.container = container;
        this.quizSelector = this.container.find('.jq-quiz__select');
        this.quizBoard = this.container.find('.jq-quiz__board');
        this.quizTitle = this.container.find('.jq-quiz__title');
        this.quizTimer = this.container.find('.jq-quiz__timer');
        this.quizSteps = this.container.find('.jq-quiz__steps');
        this.quizQuestion = this.container.find('.jq-quiz__question');
        this.quizSummary = this.container.find('.jq-quiz__summary');

        this.quizQuestion.on('click', '.jq-quiz_action', this.onAction);

        this.quizSelector.on('change', (e) => {
            let $selectedQuiz = $(e.target).val();
            this.loadQuiz($selectedQuiz)
                .then(this.showQuiz.bind(this));
        });
    }

    onAction(){

        let question = this.quiz.questions[this.quizState.currentQuestionId];

        let selectedAnswers = this.quizQuestion.find('.jq-quiz__answer:checked');

        let answers = selectedAnswers.map((idx, el) => {
            return $(el).val();
        });

        function correct(){

            if(answers.length !== question.correct.length){
                return false;
            }

            return answers
                .filter((item) => question.correct.indexOf(parseInt(item)) === -1)
                .length === 0;

        }
        if(correct()){
            this.quizState.correct++;
            this.updateQuestionStat(this.quizState.currentQuestionId, 1);
        }
        else {
            this.quizState.wrong++;
            this.updateQuestionStat(this.quizState.currentQuestionId, -1);
        }


        if(this.quizState.currentQuestionId === this.quiz.questions.length - 1){
            this.hideQuestion();
            this.showSummary();
        }
        else {
            this.showQuestion(this.quizState.currentQuestionId + 1);
        }


    }

    hideQuestion(){
        this.quizQuestion.html('');
    }

    updateQuestionStat(questionId, stat){

        this.quizState.questionStats[questionId] = stat;

        let tpl = this.quiz.questions.map((question, index) => {
            let questionState = this.quizState.questionStats[index];

            let className = '';
            if(typeof questionState === 'undefined'){
                className = 'not-visited';
            }
            else if(questionState === null){
                className = 'current';
            }
            else if(questionState === 1){
                className = 'correct';
            }
            else if(questionState === -1){
                className = 'wrong';
            }
            else if(questionState === 0){
                className = 'missed';
            }

            return `<li class="${className}">${index+1}</li>`;
        }).join('\n');

        $(this.quizSteps).html(tpl);
    }

    showSummary(){
        let tpl = `summary`;
        this.quizSummary.html(tpl);
    }

    onTimeLeft(){

        this.quizState.missed++;
        this.updateQuestionStat(this.quizState.currentQuestionId, 0);

    }


    showQuiz(quizJson){

        this.quiz = quizJson;
        this.quiz.questions = shuffle(this.quiz.questions); // todo: refactor
        this.quizState = {
           correct: 0,
           wrong: 0,
           missed: 0,
           questionStats: []
        };
        this.showTitle();
        this.initStats();
        this.showQuestion(0);
        this.showBoard();

    }

    initStats(){

        let length = this.quiz.questions.length;
        let html = ``;

        for(let i = 0; i < length;i++){
            html += `<li class="step-progress__item not-visited" data-id="${i}">${i+1}</li>`;
        }

        this.quizSteps.html(html);

    }



    showTitle(){
        this.quizTitle.html(this.quiz.name);
    }

    showQuestion(questionId){

        let question = this.quiz.questions[questionId];

        this.quizState.currentQuestionId = questionId;

        this.updateQuestionStat(this.quizState.currentQuestionId, null);

        if(!question){
            return;
        }

        let optionType = 'radio';
        if(question.correct.length > 1){
            optionType = 'checkbox';
        }

        let options = ``;
        for(let [index, answer] of shuffle(question.answers).entries()){
            options += `<li><input class="jq-quiz__answer" type="${optionType}" name="${questionId}" value="${index}">${answer}</li>`;
        }

        let buttonValue = 'Dalej';
        if(questionId === this.quiz.questions.length - 1){
            buttonValue = 'Zakończ';
        }

        let button = `<button class="jq-quiz__action">${buttonValue}</button>`;

        let tpl = `
        <div class="quiz-question">
            <ul class="quiz-question__options">
                ${options}
            </ul>
            ${button}
        </div>`;


        $(this.quizQuestion).html(tpl);
        $(this.quizQuestion).find('.jq-quiz__action').click(() => {
            timer.stop();
            this.onAction();
        });

        let timer = new Timer(this.quizTimer);
        timer.start(() => this.onTimeLeft());

    }

    showBoard(){
        this.quizBoard.removeClass('hidden');
    }

    loadQuiz(quizId = 1){

        return new Promise((resolve, reject) => {

            if(isNaN(quizId)){
                reject();
            }
            $.get('./quiz/quiz-' + quizId + '.json')
                .then(function(result){
                   resolve(result);
                });

        });

    }

}

class Timer {

    constructor(container, max = 20){

        this.max = max;
        this.container = container;
        this.progress =  $(container).find('.jq-timer__progress');
        this.time = 0;
        this.loop = null;

    }

    start(onStop){

        if(this.loop){
            return;
        }

        this.loop = setInterval(() => {
           this.time++;
           this.updateProgress();

           if(this.time + 1 > this.max){
               this.stop(onStop);
           }

        }, 1000);

    }

    updateProgress(){
        this.progress.css('width', `${(this.time/this.max)*100}%`)
    }

    stop(onStop){
        if(this.loop){
            clearInterval(this.loop);
            if(onStop && typeof onStop === 'function'){
                onStop();
            }
        }
    }
}

$(function(){
    let quizz = new Quiz($('#quiz-1'));
});


class QuizState {

}

