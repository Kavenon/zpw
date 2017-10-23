var Student = /** @class */ (function () {
    function Student(_imie, _nazwisko, dataUr, opis) {
        this._imie = _imie;
        this._nazwisko = _nazwisko;
        this.dataUr = dataUr;
        this.opis = opis;
    }
    Object.defineProperty(Student.prototype, "imie", {
        get: function () {
            return this._imie;
        },
        set: function (value) {
            console.log('invoked setter imie');
            this._imie = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Student.prototype, "nazwisko", {
        get: function () {
            console.log('invoked getter imie');
            return this._nazwisko;
        },
        set: function (value) {
            this._nazwisko = value;
        },
        enumerable: true,
        configurable: true
    });
    Student.prototype.consoleLog = function () {
        console.log(this);
    };
    Student.prototype.opisHTML = function () {
        return "<h1>" + this.imie + " " + this.nazwisko + "</h1><p>" + this.opis + "</p>";
    };
    return Student;
}());
var student = new Student('Kamil', 'Chlebek', '1994/05/03', 'opis');
student.imie = 'Kamil!';
console.log('--------------');
student.consoleLog();
console.log(student.opisHTML());
;
// --------------------------------
var studenci = [new Student('Jan', 'Kowalski', '1992/02/28', 'Uzdolniony informatyk, szczególnie w ...'),
    new Student('Zosia', 'Nowak', '1991/06/12', 'Szczególne zainteresowania: grafika komputerowa'),
    new Student('Wojciech', 'Kaczor', '1989/06/12', 'Trzeci raz powtarza 4 rok ...')];
var Grupa = /** @class */ (function () {
    function Grupa(listaStudentow) {
        this.listaStudentow = listaStudentow;
    }
    Grupa.prototype.pokazListe = function () {
        return this.listaStudentow.map(function (student) { return student.imie + " " + student.nazwisko; });
    };
    Grupa.prototype.wybranyStudent = function (id) {
        return this.listaStudentow[id];
    };
    return Grupa;
}());
var grupa = new Grupa(studenci);
console.log(grupa.pokazListe());
document.getElementById('lista').innerHTML = grupa.pokazListe().map(function (el, index) { return "<li onclick=\"openStudent(" + index + ")\">" + el + "</li>"; }).join('');
function openStudent(id) {
    var student2 = grupa.wybranyStudent(id);
    document.getElementById('student').innerHTML = student2.opisHTML();
}
