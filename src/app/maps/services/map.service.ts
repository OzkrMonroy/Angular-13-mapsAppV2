import { Injectable } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions.interface';
import { Feature } from '../interfaces/places.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];

  constructor( private directionsApi: DirectionsApiClient ) { }

  get isMapReady(): boolean {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) return;

    this.map?.flyTo({
      zoom: 12,
      center: coords,
    });
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this.map) return;
    const newMarkers = [];
    this.markers.forEach((marker) => marker.remove());
    
    for (const place of places) {
      const [lng, lat] = place.center;

      const newPopup = new Popup().setHTML(`<h6>${place.text_es}</h6>
      <span>${place.place_name}</span> `);

      const newMarker = new Marker()
        .setPopup(newPopup)
        .setLngLat([lng, lat])
        .addTo(this.map);

      newMarkers.push(newMarker);
    }
    this.markers = newMarkers;
    if(places.length === 0) return;

    // Set limits for map
    const bounds = new LngLatBounds();
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);

    this.map.fitBounds(bounds, { padding: 200 });
  }

  getRouteBetweenPoints(origin: [number, number], destination: [number, number]) {
    this.directionsApi.get<DirectionsResponse>(`/${origin.join(',')};${destination.join(',')}`)
      .subscribe({
        next: resp => {
          this.drawStringLine(resp.routes[0])
        }
      })
  }

  private drawStringLine(route: Route){
    console.log({ km: route.distance / 1000, duration: route.duration / 60 });
    
    if(!this.map) return;
    const coords = route.geometry.coordinates;
    const start = coords[0] as [number, number];

    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));
    bounds.extend(start);
    
    this.map.fitBounds(bounds, { padding: 200 })
  }
}
