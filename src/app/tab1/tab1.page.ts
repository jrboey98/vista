import { Component} from '@angular/core';

import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';

import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Geolocation } from '@ionic-native/geolocation/ngx';

export interface Pictures {
  path: string;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  public localImagePaths: Array<string> = [];
  public localImages: Array<any> = [];
  public pictureCollection: AngularFirestoreCollection<Pictures>;
  public picture$: Observable<Pictures[]>;
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
      // self.latitude = response.coords.latitude;
      // self.longitude = response.coords.longitude;
      self.latitude = 41.2625542;
      self.longitude = -81.8379279;
    }).finally(() => {
      self.latitudeCollection = self.db.collection<Pictures>('PictureReferences', ref => {
        return ref.where('latitude', '<', self.latitude + 0.001).where('latitude', '>', self.latitude - 0.001);
      });
      self.longitudeCollection = self.db.collection<Pictures>('PictureReferences', ref => {
        return ref.where('longitude', '<', self.longitude + 0.001).where('longitude', '>', self.longitude - 0.001);
      });

      self.latitude$ = self.latitudeCollection.valueChanges();
      self.longitude$ = self.longitudeCollection.valueChanges();

      self.latitude$.subscribe(
        result => {
          for (const picture of result) {
            self.latitudePathArray.push(picture.path);
            self.GetPhotos();
          }
        });
        self.longitude$.subscribe(
          result => {
            for (const picture of result) {
              self.longitudePathArray.push(picture.path);
            }
            self.localImagePaths = self.andArray(self.latitudePathArray, self.longitudePathArray);
            self.GetPhotos();
          }
        );
    });
    // this.pictureCollection = this.db.collection<Pictures>('PictureReferences', ref => {
    //   return ref.orderBy('date', 'desc');
    // });
    // this.picture$ = this.pictureCollection.valueChanges();
    // this.picture$.subscribe(
    //   result => {
    //     for (const picture of result) {
    //       if (!this.localImagePaths.includes(picture.path)) {
    //         this.localImagePaths.push(picture.path);
    //       }
    //     }
    //     this.GetPhotos();
    //   }
    // );
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
