import {Component, OnInit} from '@angular/core';
import { Bike } from '../bike';
import { BikeService } from '../bike.service';

@Component({
  selector: 'bike-list',
  templateUrl: './bike-list.component.html',
  styleUrls: ['./bike-list.component.css']
})
export class BikeListComponent implements OnInit {

  bikes: Bike[];
  bikeCount: number;

  constructor(private bikeService: BikeService){
  }


  ngOnInit(): void {
    this.bikeService.getBikes().then((bikes) => {
      this.bikes = bikes;
      this.calculateBikeCount();
    });

  }

  calculateBikeCount(){
      this.bikeCount = this.bikes.reduce((p,c) => p + c.count, 0);
  }

  onOrder(bike){
      bike.ordered++;
      bike.count--;
      this.calculateBikeCount();
  }

  onReturn(bike){
      bike.ordered--;
      bike.count++;
      this.calculateBikeCount();
  }

  getCountStyle(){
    return {
      backgroundColor: this.bikeCount >= 10 ? 'green': 'red'
    };
  }

}
