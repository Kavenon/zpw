class Student {
    constructor(private _imie: string, private _nazwisko: string, private dataUr: string, private opis:string){

    }


    get imie(): string {
        return this._imie;
    }

    set imie(value: string) {
        console.log('invoked setter imie');
        this._imie = value;
    }

    get nazwisko(): string {
        console.log('invoked getter imie');
        return this._nazwisko;
    }

    set nazwisko(value: string) {
        this._nazwisko = value;
    }

    consoleLog(): void {
        console.log(this);
    }

    opisHTML(): string {
        return `<h1>${this.imie} ${this.nazwisko}</h1><p>${this.opis}</p>`;
    }
}


let student = new Student('Kamil', 'Chlebek', '1994/05/03', 'opis');

student.imie = 'Kamil!';

console.log('--------------');

student.consoleLog();
console.log(student.opisHTML());;


// --------------------------------

let studenci = [new Student('Jan','Kowalski','1992/02/28','Uzdolniony informatyk, szczególnie w ...'),
new Student('Zosia','Nowak','1991/06/12','Szczególne zainteresowania: grafika komputerowa'),
new Student('Wojciech','Kaczor','1989/06/12','Trzeci raz powtarza 4 rok ...')];

class Grupa {
    constructor(private listaStudentow: Student[]){

    }
    pokazListe(): string[]{
        return this.listaStudentow.map((student) => `${student.imie} ${student.nazwisko}`);
    }
    wybranyStudent(id): Student {
        return this.listaStudentow[id];
    }
}

let grupa = new Grupa(studenci);

console.log(grupa.pokazListe());

document.getElementById('lista').innerHTML = grupa.pokazListe().map((el, index) => `<li onclick="openStudent(${index})">${el}</li>`).join('');

function openStudent(id){
    let student2 = grupa.wybranyStudent(id);
    document.getElementById('student').innerHTML = student2.opisHTML();
}
