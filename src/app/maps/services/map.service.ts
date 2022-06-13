import { Injectable } from '@angular/core';
import { LngLatLike, Map } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: Map;

  get isMapReady(): boolean {
    return !!this.map;
  }

  setMap(map: Map){
    this.map = map;
  }

  flyTo(coords: LngLatLike){
    if(!this.isMapReady) return;

    this.map?.flyTo({
      zoom: 12,
      center: coords
    })
  }
}
