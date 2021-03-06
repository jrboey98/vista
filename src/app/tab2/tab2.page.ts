import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
  public base64Image: string;
  public displayedImage = new Image();
  public locationMetadata: any;
  public latitude: number;
  public longitude: number;

  public isFinishedUploading: boolean;
  public uploading: boolean;

  constructor(private camera: Camera, private domSanitizer: DomSanitizer,
              protected webview: WebView, private geolocation: Geolocation,
              private db: AngularFirestore) {
                if (!firebase.apps.length) {
                  firebase.initializeApp(environment.firebase);
                }
                this.isFinishedUploading = false;
                this.uploading = false;
              }

  public takePicture() {
    this.isFinishedUploading = false;
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };

    this.getLocationData();
    this.capturePicture(options);
  }

  public SavePicture() {
    const self = this;
    self.uploading = true;
    const storageRef = firebase.storage().ref();
    const filename = Date.now().toString();
    const imageRef = storageRef.child(`images/${filename}.jpg`);
    self.uploading = true;

    const task = imageRef.putString(this.base64Image, 'base64', { contentType: 'image/jpeg'}).then(function(snapshot) {
      console.log('Uploaded Picture');
      self.isFinishedUploading = true;
      self.uploading = false;

      imageRef.updateMetadata(self.locationMetadata).then((metadata) => {
        console.log(`latitude: ${metadata.customMetadata.latitude}\nlongitude: ${metadata.customMetadata.longitude}`);
      }).catch((error) => {
        debugger;
        console.log('Error creating metadata', error);
      });

      const pictureCollectionRef = self.db.collection('PictureReferences');
      pictureCollectionRef.add({
        path: `images/${filename}.jpg`,
        latitude: self.latitude,
        longitude: self.longitude,
        date: Date()
      });
    }).catch((error) => {
      debugger;
      console.log('Error uploading picture', error);
    });
  }

  private getLocationData() {
    this.geolocation.getCurrentPosition().then((response: any) => {
      this.locationMetadata = {
        customMetadata: {
          'latitude': `${response.coords.latitude}`,
          'longitude': `${response.coords.longitude}`
        }
      };
      this.latitude = response.coords.latitude;
      this.longitude = response.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  private capturePicture(options: CameraOptions) {
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = imageData;
      this.displayedImage.src = 'data:image/png;base64,' + this.base64Image;
    }, (err) => {
      console.log(err);
     });
  }

  private updateMetadata(imageRef){
    imageRef.updateMetadata(this.locationMetadata).then((metadata) => {
      console.log(`latitude: ${metadata.customMetadata.latitude}\nlongitude: ${metadata.customMetadata.longitude}`);
    }).catch((error) => {
      debugger;
      console.log('Error creating metadata', error);
    });
  }
}
