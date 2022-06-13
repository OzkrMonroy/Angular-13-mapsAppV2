import { Component, OnInit } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent implements OnInit {

  constructor(private placesService: PlacesService, private mapService: MapService) { }

  ngOnInit(): void {
  }

  goToMyLocation():void {
    if(this.placesService.isUserLocationReady && this.mapService.isMapReady){
      this.mapService.flyTo(this.placesService.userLocation!);
    }
  }
}
