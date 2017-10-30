import { Injectable } from '@angular/core';

import bikeMock from './bike.mock';

@Injectable()
export class BikeService {

  getBikes(){
      return Promise.resolve(bikeMock);
  }

}
