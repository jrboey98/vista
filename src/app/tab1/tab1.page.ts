import { Component} from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';

import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

export interface Pictures {
  path: string;
  latitude: number;
  longitude: number;
  date: Date;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  public localImagePaths: Array<string> = [];
  public localImages: Array<any> = [];
  public latitude: number;
  public latitudeCollection: AngularFirestoreCollection<Pictures>;
  public latitude$: Observable<Pictures[]>;
  public longitude: number;
  public longitudeCollection: AngularFirestoreCollection<Pictures>;
  public longitude$: Observable<Pictures[]>;
  public latitudePathArray: string[] = [];
  public longitudePathArray: string[] = [];

  constructor(private db: AngularFirestore, private geolocation: Geolocation) {
    const self = this;

    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }
    this.geolocation.getCurrentPosition().then((response: any) => {
      self.latitude = response.coords.latitude;
      self.longitude = response.coords.longitude;
    }).finally(() => {
      self.queryPhotos(self);
      self.populateArrays(self);
    });
  }

  public GetPhotos(): void {
    const storage = firebase.storage();
    this.localImages.length = this.localImagePaths.length;
    for (let i = 0; i < this. localImagePaths.length; i++) {
      const pathReference = storage.ref(this.localImagePaths[i]);
      pathReference.getDownloadURL().then((url) => {
        this.localImages[i] = url;
      });
    }
  }

  private queryPhotos(self: this) {
    const latitudeUpperLimit = self.latitude + 0.01;
    const latitudeLowerLimit = self.latitude - 0.01;
    const longitudeUpperLimit = self.longitude + 0.01;
    const longitudeLowerLimit = self.longitude - 0.01;

    self.latitudeCollection = self.db.collection<Pictures>('PictureReferences', ref => {
      return ref.where('latitude', '<', latitudeUpperLimit).where('latitude', '>', latitudeLowerLimit);
    });
    self.longitudeCollection = self.db.collection<Pictures>('PictureReferences', ref => {
      return ref.where('longitude', '<', longitudeUpperLimit).where('longitude', '>', longitudeLowerLimit);
    });

    self.latitude$ = self.latitudeCollection.valueChanges();
    self.longitude$ = self.longitudeCollection.valueChanges();
  }

  private populateArrays(self: this) {
    self.latitude$.subscribe(
      result => {
        result.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
        for (const picture of result) {
          self.latitudePathArray.push(picture.path);
          self.GetPhotos();
        }
      });
      self.longitude$.subscribe(
        result => {
          result.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
          for (const picture of result) {
            self.longitudePathArray.push(picture.path);
          }
          self.localImagePaths = self.andArray(self.latitudePathArray, self.longitudePathArray);
          self.GetPhotos();
        }
      );
  }

  private andArray(arrayA: any, arrayB: any): string[] {
    const returnedArray: string[] = [];
    for (let i = 0; i < arrayA.length; i++) {
      if (arrayB.includes(arrayA[i])) {
        returnedArray.push(arrayA[i]);
      }
    }
    return returnedArray;
  }
}
