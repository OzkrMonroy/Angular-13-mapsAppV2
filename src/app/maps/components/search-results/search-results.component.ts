import { Component, OnInit } from '@angular/core';
import { Feature } from '../../interfaces/places.interfaces';
import { PlacesService, MapService } from '../../services';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  public selectedId: string = '';

  constructor(private placesService: PlacesService, private mapService: MapService) { }

  ngOnInit(): void {
  }

  get isLoadingPlaces():boolean{
    return this.placesService.isLoadingPlaces;
  }

  get places():Feature[]{
    return this.placesService.places;
  }

  flyTo(place: Feature){
    this.selectedId = place.id;
    const [lng,lat] = place.center;
    this.mapService.flyTo([lng,lat]);
  }

  getDirections(place: Feature):void{
    if(!this.placesService.userLocation) return;

    const origin = this.placesService.userLocation;
    const destination = place.center as [number, number];

    this.mapService.getRouteBetweenPoints(origin, destination)
  }

}
