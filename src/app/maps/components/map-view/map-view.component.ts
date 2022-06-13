import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
  userLocation: [number, number] | undefined;

  constructor(private placesService: PlacesService) { }

  ngOnInit(): void {
    this.userLocation = this.placesService.userLocation;
    console.log(this.userLocation);
    
  }

}
