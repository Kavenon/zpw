function tabliczka(a1, a2) {
    for (var _i = 0, a1_1 = a1; _i < a1_1.length; _i++) {
        var str = a1_1[_i];
        var result = '';
        for (var numKey in a2) {
            result += "" + str + a2[numKey];
        }
        console.log(result);
    }
}
tabliczka(['Ala', 'ma', 'kota'], [0, 1, 2, 3]);
