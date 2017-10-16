class Quiz {

    constructor(container){

        this.container = container;
        this.quizSelector = this.container.find('.jq-quiz__select');
        this.quizBoard = this.container.find('.jq-quiz__board');
        this.quizTitle = this.container.find('.jq-quiz__title');
        this.quizSteps = this.container.find('.js-quiz__steps');


        this.quizSelector.on('change', (e) => {
            let $selectedQuiz = $(e.target).val();
            this.loadQuiz($selectedQuiz)
                .then(this.showQuiz.bind(this));
        });
    }

    showQuiz(quizJson){

        this.quiz = quizJson;
        this.quizState = {
           step: 0,
           correct: 0,
           wrong: 0,
           missed: 0
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
            html += `<li class="step-progress__item js-quiz__step" data-id="${i}">${i+1}</li>`;
        }

        this.quizSteps.html(html);

    }

    showTitle(){
        this.quizTitle.html(this.quiz.name);
    }

    showQuestion(question){

    }

    showBoard(){
        this.quizBoard.removeClass('hidden');
    }

    loadQuiz(quizId = 1){

        return new Promise((resolve, reject) => {

            if(isNaN(quizId)){
                reject();
            }
            $.get('./quiz/quiz-' + quizId + '.json').then(function(result){
               resolve(result);
            });

        });

    }

}

class Timer {

    constructor(container, max = 20){

        this.max = max;
        this.container = container;
        this.time = 1;
        this.loop = null;

    }

    start(){

        if(this.loop){
            return;
        }

        this.loop = setInterval(() => {
           this.time++;
           this.updateProgress();

           if(this.time > this.max){
               this.stop();
           }

        }, 1000);

    }

    stop(){
        if(this.loop){
            clearInterval(this.loop);
        }
        this.time = 0;
        this.loop = null;
    }
}

$(function(){
    quizz = new Quiz($('#quiz-1'));
});


class QuizState {

}

