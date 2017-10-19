'use strict';

const _CORRECT_STATE = 1;
const _WRONG_STATE = -1;
const _MISSED_STATE = 0;

class Quiz {

    constructor(container) {

        this.container = container;
        this.quizSelector = this.container.find('.jq-quiz__select');
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

    onAction() {

        let selectedAnswers = this.quizQuestion.find('.jq-quiz__answer:checked');
        let answerIds = selectedAnswers.map((idx, el) => {
            return $(el).val();
        });

        if (this.quizState.currentQuestion.correct(answerIds)) {
            this.quizState.correct++;
            this.updateQuestionStat(this.quizState.currentQuestionId, _CORRECT_STATE);
        }
        else {
            this.quizState.wrong++;
            this.updateQuestionStat(this.quizState.currentQuestionId, _WRONG_STATE);
        }

        this.nextStep();

    }

    nextStep() {

        if (this.quizState.currentQuestionId === this.quiz.questions.length - 1) {
            this.hideQuestion();
            this.showSummary();
        }
        else {
            this.showQuestion(this.quizState.currentQuestionId + 1);
        }

    }

    updateQuestionStat(questionId, stat) {

        this.quizStats.update(questionId, stat);
        this.quizStats.draw();

    }

    showSummary() {

        let quizSummary = new QuizSummary(this.quizState, this.quiz);
        quizSummary.calculateAndStoreResult();

        this.container.removeClass('quiz--board');
        this.container.addClass('quiz--summary');

        this.quizSummary.html(quizSummary.render());

    }

    onTimeLeft() {

        this.quizState.missed++;
        this.updateQuestionStat(this.quizState.currentQuestionId, _MISSED_STATE);
        this.nextStep();

    }


    showQuiz(quizJson) {

        this.quiz = quizJson;
        this.quiz.questions = shuffle(this.quiz.questions);
        this.quizState = {
            correct: 0,
            wrong: 0,
            missed: 0
        };

        this.quizStats = new QuizStats(this.quiz, this.quizSteps);
        this.quizStats.draw();

        this.showTitle();
        this.showQuestion(0);
        this.showBoard();

    }

    showQuestion(questionId) {

        let question = new Question(this.quiz.questions[questionId]);

        this.quizState.currentQuestionId = questionId;
        this.quizState.currentQuestion = question;

        this.updateQuestionStat(this.quizState.currentQuestionId, null);

        let buttonValue = 'Dalej';
        if (questionId === this.quiz.questions.length - 1) {
            buttonValue = 'Zakończ';
        }

        let button = `<button type="button" class="btn btn-primary jq-quiz__action">${buttonValue}</button>`;

        let tpl = `${question.render()}${button}`;

        $(this.quizQuestion).html(tpl);
        $(this.quizQuestion).find('.jq-quiz__action').click(() => {
            timer.stop();
            this.onAction();
        });

        let timer = new Timer(this.quizTimer);
        timer.start(() => this.onTimeLeft());

    }

    loadQuiz(quizId) {

        return new Promise((resolve, reject) => {

            if (!quizId || isNaN(quizId)) {
                reject();
            }
            $.get('./quiz/quiz-' + quizId + '.json')
                .then(function (result) {
                    resolve(result);
                })
                .catch(() => alert('Nie znaleziono quizu.'))

        });

    }

    showTitle() {

        this.quizTitle.html(this.quiz.name);

    }

    showBoard() {

        this.container.removeClass('quiz--select');
        this.container.addClass('quiz--board');

    }

    hideQuestion() {

        this.quizQuestion.html('');

    }

}

class QuizSummary {

    constructor(quizState, quiz){

        this.quizState = quizState;
        this.quiz = quiz;

    }

    calculateAndStoreResult(){

        let results = this.generateResult();

        this.storeResults(results);

        this.improvedCorrect = this.calculateChange(results);
        this.percentageResult = ((this.quizState.correct / this.quiz.questions.length) * 100);

    }

    generateResult(){

        let results = [];
        let storedResults = localStorage.getItem('_quiz');
        if (storedResults) {
            results = JSON.parse(storedResults);
        }

        results.push({
            time: new Date(),
            correct: this.quizState.correct,
            wrong: this.quizState.wrong,
            missed: this.quizState.missed
        });

        return results;

    }

    storeResults(results){
        localStorage.setItem('_quiz', JSON.stringify(results));
    }

    calculateChange(results){
        let improvedCorrect = null;
        if (results.length > 1) {
            let previousCorrect = results[results.length - 2].correct;
            improvedCorrect = previousCorrect === 0 ? 1 : (this.quizState.correct - previousCorrect) / previousCorrect;
            improvedCorrect = improvedCorrect * 100;
        }
        return improvedCorrect;
    }

    render() {

        let tpl = `
        Ocena: ${this.percentageResult.toFixed(2)}%<br />
        <div class="timer">
            <div class="timer__progress" style="width:${this.percentageResult}%"></div>
        </div><br />`;

        if (this.improvedCorrect !== null) {
            tpl += `W porównaniu do poprzedniego wyniku: ${this.improvedCorrect.toFixed(2)}%`;
        }
        return tpl;

    }

}

class QuizStats {

    constructor(quiz, statsContainer) {
        this.quiz = quiz;
        this.statsContainer = statsContainer;
        this.stats = [];
    }

    update(id, value) {
        this.stats[id] = value;
    }

    draw() {
        let tpl = this.quiz.questions.map((question, index) => {
            let questionState = this.stats[index];

            let className = '';
            if (typeof questionState === 'undefined') {
                className = 'not-visited';
            }
            else if (questionState === null) {
                className = 'current';
            }
            else if (questionState === _CORRECT_STATE) {
                className = 'correct';
            }
            else if (questionState === _WRONG_STATE) {
                className = 'wrong';
            }
            else if (questionState === _MISSED_STATE) {
                className = 'missed';
            }

            return `<li class="step-progress__item ${className}">${index + 1}</li>`;
        }).join('\n');

        $(this.statsContainer).html(tpl);
    }
}

class Question {

    constructor(data) {
        this.data = data;
    }

    correct(answers) {

        if (answers.length !== this.data.correct.length) {
            return false;
        }

        return answers
            .get()
            .filter((item) => this.data.correct.indexOf(parseInt(item)) === -1)
            .length === 0;

    }

    render() {

        let question = this.data;

        if (!question) {
            return;
        }

        let optionType = Question._getOptionType(question);

        let options = ``;
        for (let [index, answer] of shuffle(question.answers).entries()) {
            options += `
            <li>
                <label for="o${index}">
                    <input class="jq-quiz__answer" id="o${index}" type="${optionType}" name="question" value="${question.answers.indexOf(answer)}">${answer}
                </label>
            </li>`;
        }

        return `
        <div class="quiz-question">
            <p class="quiz-question__topic">
                ${question.question}
            </p>
            <ul class="quiz-question__options">
                ${options}
            </ul>
        </div>`;

    }

    static _getOptionType(question) {
        let optionType = 'radio';
        if (question.correct.length > 1) {
            optionType = 'checkbox';
        }
        return optionType;
    }
}

class Timer {

    constructor(container, max = 20) {

        this.max = max;
        this.container = container;
        this.progress = $(container).find('.timer__progress');
        this.time = 0;
        this.loop = null;

    }

    start(onStop) {

        this.updateProgress();

        if (this.loop) {
            return;
        }

        this.loop = setInterval(() => {
            this.time++;
            this.updateProgress();

            if (this.time + 1 > this.max) {
                this.stop(onStop);
            }

        }, 1000);

    }

    updateProgress() {
        this.progress.css('width', `${(this.time / this.max) * 100}%`)
    }

    stop(onStop) {
        if (this.loop) {
            clearInterval(this.loop);
            if (onStop && typeof onStop === 'function') {
                onStop();
            }
        }
    }
}

function shuffle(array) {
    array = [].concat(array);
    return array.sort(function () {
        return .5 - Math.random();
    });
}

$(function () {
    new Quiz($('#quiz-1'));
});
