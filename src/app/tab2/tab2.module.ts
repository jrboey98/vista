import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { Camera } from '@ionic-native/camera/ngx';
import { Options } from 'selenium-webdriver/safari';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],
  providers: [
    Camera
  ] ,
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
