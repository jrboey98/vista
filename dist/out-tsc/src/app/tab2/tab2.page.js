var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { environment } from '../../environments/environment';
import * as firebase from 'firebase';
var Tab2Page = /** @class */ (function () {
    function Tab2Page(camera, domSanitizer, webview) {
        this.camera = camera;
        this.domSanitizer = domSanitizer;
        this.webview = webview;
        firebase.initializeApp(environment.firebase);
    }
    Tab2Page.prototype.takePicture = function () {
        var _this = this;
        var options = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };
        this.camera.getPicture(options).then(function (imageData) {
            _this.base64Image = _this.webview.convertFileSrc(imageData);
        }, function (err) {
            console.log(err);
        });
    };
    Tab2Page.prototype.SavePicture = function () {
        var storageRef = firebase.storage().ref('testPhotos/test.jpg');
        var task = storageRef.put(this.base64Image);
        console.log('task:');
        console.log(task);
        task.on('state_changed', function progress(snapshot) {
        }, function error(err) {
        }, function complete() {
        });
    };
    Tab2Page = __decorate([
        Component({
            selector: 'app-tab2',
            templateUrl: 'tab2.page.html',
            styleUrls: ['tab2.page.scss']
        }),
        __metadata("design:paramtypes", [Camera, DomSanitizer,
            WebView])
    ], Tab2Page);
    return Tab2Page;
}());
export { Tab2Page };
//# sourceMappingURL=tab2.page.js.map