class Bike {

  constructor(private id: number, private name: string, private description: string,
              private _count:number, private price: Price, private ordered: number, private img: string){

  }

  get count(): number {
    return this._count;
  }


  set count(value: number) {
    this._count = value;
  }
}

interface Price {
  value: number,
  currency: string
}

export { Bike };
