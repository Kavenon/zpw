function tabliczka(a1:string[], a2:number[]){

    for(let str of a1){

        let result = '';

        for(let numKey in a2){

            result += `${str}${a2[numKey]}`;

        }
        console.log(result);
    }

}

tabliczka(['Ala', 'ma', 'kota'], [0,1,2,3]);
