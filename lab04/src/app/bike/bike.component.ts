import { Component, Input, EventEmitter, Output} from '@angular/core';
import {Bike} from '../bike';

@Component({
  selector: 'bike',
  templateUrl: './bike.component.html',
  styleUrls: ['./bike.component.css']
})
export class BikeComponent {

  @Input() bike: Bike;
  @Output() onOrder = new EventEmitter<void>();
  @Output() onReturn = new EventEmitter<void>();

  orderBike(){
      this.onOrder.emit();
  }

  returnBike(){
      this.onReturn.emit();
  }

}
