import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { environment } from '../../environments/environment';

import * as firebase from 'firebase';
import { fileURLToPath } from 'url';
import { ObjectUnsubscribedError } from 'rxjs';
import { discardPeriodicTasks } from '@angular/core/testing';
import { TabsDelegate } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public base64Image: string;
  public displayedImage = new Image();
  public imageBlob: Blob;

  constructor(private camera: Camera, private domSanitizer: DomSanitizer,
              protected webview: WebView) {
                firebase.initializeApp(environment.firebase);
              }

  public takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = imageData;
      this.displayedImage.src = 'data:image/png;base64,' + this.base64Image;
      debugger;
    }, (err) => {
      console.log(err);
     });
  }

  public SavePicture() {
    const storageRef = firebase.storage().ref();
    const filename = Date.now().toString();
    const imageRef = storageRef.child(`images/${filename}.jpg`);
    const task = imageRef.putString(this.base64Image, 'base64', { contentType: 'image/jpeg'}).then(function(snapshot) {
      console.log('Uploaded Picture');
    });
  }

  // private ConvertBaseSixtyFourToBlob(base64Data: string, contentType: string, sliceSize: number): Blob {
  //   contentType = contentType || '';
  //       sliceSize = sliceSize || 512;

  //       const byteCharacters = atob(base64Data);
  //       const byteArrays = [];

  //       for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
  //           const slice = byteCharacters.slice(offset, offset + sliceSize);

  //           const byteNumbers = new Array(slice.length);
  //           for (let i = 0; i < slice.length; i++) {
  //               byteNumbers[i] = slice.charCodeAt(i);
  //           }

  //           const byteArray = new Uint8Array(byteNumbers);

  //           byteArrays.push(byteArray);
  //       }

  //     const blob = new Blob(byteArrays, {type: contentType});
  //     return blob;
  // }
}
