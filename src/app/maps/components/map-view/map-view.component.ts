import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PlacesService } from '../../services';
import { Map, Marker, Popup } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css'],
})
export class MapViewComponent implements AfterViewInit {
  userLocation: [number, number] | undefined;
  @ViewChild('map') mapElement!: ElementRef;

  constructor(private placesService: PlacesService) {}
  ngAfterViewInit(): void {
    this.userLocation = this.placesService.userLocation;
    if (!this.userLocation) return;

    const map = new Map({
      container: this.mapElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.userLocation,
      zoom: 9,
    });

    const popup = new Popup().setHTML(`
        <h6>I'm here!</h6>
        <span>In this place in the world!</span>
      `);
    new Marker({ color: 'red' })
      .setPopup(popup)
      .setLngLat(this.userLocation)
      .addTo(map);
  }
}
