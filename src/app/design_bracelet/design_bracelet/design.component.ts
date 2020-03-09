import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import Stepper from 'bs-stepper';

@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss']
})
export class DesignComponent implements OnInit {

  @Input() wristSize: number;
  @Input() stoneSize: number;
  @Input() stoneShape: string;
  @Input() isstep2: boolean;
  @Input() isstep3: boolean;
  @Input() bracelet_img;
  // @ts-ignore
  @ViewChild('stepper1') stepper1: ElementRef;

  private stepper: Stepper;


  _wristSize: number;
  _stoneSize: number;
  _stoneShape: string;
  _isStep2 = false;
  _isStep1 = true;
  _isStep3 = false;
  _bracelet_img;

  constructor() { }

  ngOnInit() {

  }

  getIsStep2(isstep2 : boolean ){
    this._isStep2  = isstep2;
    this._isStep1 = false;
    this._isStep3 = false;
  }
  getIsStep3(isstep3 : boolean ){
    this._isStep2  = false;
    this._isStep1 = false;
    this._isStep3 = true;
    console.log(this._bracelet_img)
  }
  getIsStep1(isstep1 : boolean ){
    this._isStep2  = !isstep1;
    this._isStep1 = isstep1;
    this._isStep3 = !isstep1;
    console.log(this._bracelet_img)
  }
  getWristSize(wristSize : number){
    this._wristSize = wristSize;
  }

  getStoneSize(stoneSize : number){
    this._stoneSize = stoneSize;
  }

  getStoneShape(stoneShape : string){
    this._stoneShape = stoneShape;
  }
  getBraceletImg (bracelet_img){
    console.log('getBraceletImg')
    this._bracelet_img = bracelet_img;
  }

}
