import { Injectable } from '@angular/core';
import { LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/places.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];

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

  createMarkersFromPlaces(places: Feature[]) {
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
  }
}
