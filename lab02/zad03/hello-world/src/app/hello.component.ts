import { Component } from '@angular/core';

@Component({
  selector: 'hello-root',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent {
  title = 'app';
  imie = 'Jan';
  nazwisko = 'Kowalski';

  stud = new Student('Kamil', 'Chlebek', 3.5);
  gr: Student[] = [
    new Student('Jan', 'Kowalski', 4.0),
    new Student('Halina', 'Nowak', 2.0),
    new Student('Marek', 'Owca', 3.5),
    new Student('Beata', 'Rybak', 5.0)
  ];

}


class Student {
  constructor(private name: string, private surname: string, private degree: number){

  }
}

