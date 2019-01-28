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

  public isFinishedUploading: boolean;
  public uploading: boolean;

  constructor(private camera: Camera, private domSanitizer: DomSanitizer,
              protected webview: WebView) {
                firebase.initializeApp(environment.firebase);
                this.isFinishedUploading = false;
                this.uploading = false;
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
    }, (err) => {
      console.log(err);
     });
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
      debugger;
      self.isFinishedUploading = true;
      self.uploading = false;
    });
  }
}
