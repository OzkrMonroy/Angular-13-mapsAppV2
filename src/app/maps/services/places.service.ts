import { Injectable } from '@angular/core';
import { PlacesApiClient } from '../api';
import { Feature, Place } from '../interfaces/places.interfaces';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public userLocation: [number, number] | undefined;

  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  constructor(private placesApi: PlacesApiClient, private mapService: MapService) {
    this.getUserLocation();
  }

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        () => {
          alert('Geolocation not available');
          reject();
        }
      );
    });
  }

  getPlacesByQuery(query: string = '') {
    if(!this.userLocation) return;
    if(query.trim().length === 0){
      this.places = [];
      this.isLoadingPlaces = false;
      return;
    }

    this.isLoadingPlaces = true;
    return this.placesApi.get<Place>(`/${query}.json?`, { params: { proximity: this.userLocation.join(',') } })
      .subscribe({
        next: resp => {
          this.places = resp.features;
          this.mapService.createMarkersFromPlaces(this.places);
          this.isLoadingPlaces = false;
        }
      });
  }
}
