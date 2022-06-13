import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Feature, Place } from '../interfaces/places.interfaces';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public userLocation: [number, number] | undefined;

  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  constructor(private http: HttpClient) {
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
    this.isLoadingPlaces = true;
    const lng = this.userLocation![0];
    const lat = this.userLocation![1];
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=5&proximity=${lng}%2C${lat}&types=place%2Cpostcode%2Caddress&language=es&limit=1&access_token=${environment.mapboxToken}`;

    return this.http.get<Place>(url)
      .subscribe({
        next: resp => {
          this.places = resp.features;
          this.isLoadingPlaces = false;
        }
      });
  }
}
