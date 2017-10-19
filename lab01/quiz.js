'use strict';

function shuffle(array){
    array = [].concat(array);
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
                .get()
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


        this.nextStep();


    }

    nextStep(){
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

            return `<li class="step-progress__item ${className}">${index+1}</li>`;
        }).join('\n');

        $(this.quizSteps).html(tpl);
    }

    showSummary(){

        let results = [];
        let storedResults = localStorage.getItem('_quiz');
        if(storedResults){
            results = JSON.parse(storedResults);
        }

        results.push({
            time: new Date(),
            correct: this.quizState.correct,
            wrong: this.quizState.wrong,
            missed: this.quizState.missed
        });

        localStorage.setItem('_quiz', JSON.stringify(results));

        let improvedCorrect = null;
        if(results.length > 1){
            let previousCorrect = results[results.length - 2].correct;
            improvedCorrect = previousCorrect === 0 ? 1 : (this.quizState.correct - previousCorrect) / previousCorrect;
            improvedCorrect = improvedCorrect * 100;
        }


        let percentageResult = (this.quizState.correct/this.quiz.questions.length)*100;
        let tpl = `
        Ocena: ${percentageResult}%<br />
        <div class="timer">
            <div class="timer__progress" style="width:${percentageResult}%"></div>
        </div><br />`;

        if(improvedCorrect !== null){
            tpl += `W porównaniu do poprzedniego wyniku: ${improvedCorrect}%`;
        }

        this.container.removeClass('quiz--board');
        this.container.addClass('quiz--summary');

        this.quizSummary.html(tpl);
    }

    onTimeLeft(){

        this.quizState.missed++;
        this.updateQuestionStat(this.quizState.currentQuestionId, 0);
        this.nextStep();

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
            options += `
            <li>
                <label for="o${index}">
                    <input class="jq-quiz__answer" id="o${index}" type="${optionType}" name="${questionId}" value="${question.answers.indexOf(answer)}">${answer}
                </label>
            </li>`;
        }

        let buttonValue = 'Dalej';
        if(questionId === this.quiz.questions.length - 1){
            buttonValue = 'Zakończ';
        }

        let button = `<button type="button" class="btn btn-primary jq-quiz__action">${buttonValue}</button>`;

        let tpl = `
        <div class="quiz-question">
            <p class="quiz-question__topic">
                ${question.question}
            </p>
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
        this.container.removeClass('quiz--select');
        this.container.addClass('quiz--board');
    }

    loadQuiz(quizId = 1){

        return new Promise((resolve, reject) => {

            if(isNaN(quizId)){
                reject();
            }
            $.get('./quiz/quiz-' + quizId + '.json')
                .then(function(result){
                   resolve(result);
                })
                .catch(() => alert('Nie znaleziono quizu.'))

        });

    }

}

class Timer {

    constructor(container, max = 20){

        this.max = max;
        this.container = container;
        this.progress =  $(container).find('.timer__progress');
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


