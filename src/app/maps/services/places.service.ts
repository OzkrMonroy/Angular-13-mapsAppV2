import { Injectable } from '@angular/core';
import { PlacesApiClient } from '../api';
import { Feature, Place } from '../interfaces/places.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public userLocation: [number, number] | undefined;

  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  constructor(private placesApi: PlacesApiClient) {
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

    this.isLoadingPlaces = true;
    return this.placesApi.get<Place>(`/${query}.json?`, { params: { proximity: this.userLocation.join(',') } })
      .subscribe({
        next: resp => {
          this.places = resp.features;
          this.isLoadingPlaces = false;
        }
      });
  }
}
