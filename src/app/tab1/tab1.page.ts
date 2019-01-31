import { Component} from '@angular/core';

import { environment } from '../../environments/environment';

import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

export interface Pictures {
  path: string;
  latitude: string;
  longitude: string;
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

  constructor(private db: AngularFirestore) {
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
    }
    this.pictureCollection = this.db.collection<Pictures>('PictureReferences', ref => {
      return ref.orderBy('date');
    });
    this.picture$ = this.pictureCollection.valueChanges();
    this.picture$.subscribe(
      result => {
        for (const picture of result) {
          if (!this.localImagePaths.includes(picture.path)) {
            this.localImagePaths.push(picture.path);
          }
        }
        this.GetPhotos();
      }
    );
  }

  public GetPhotos(): void {
    this.localImagePaths.reverse();
    const storage = firebase.storage();
    this.localImages.length = this.localImagePaths.length;
    for (let i = 0; i < this. localImagePaths.length; i++) {
      const pathReference = storage.ref(this.localImagePaths[i]);
      pathReference.getDownloadURL().then((url) => {
        this.localImages[i] = url;
      });
    }
  }
}
