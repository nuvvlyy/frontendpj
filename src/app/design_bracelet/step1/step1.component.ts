import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  _wristSize : number;
  _stoneSize : number;
  _stoneShape = "C";
  isError = false;
  @Output() wristSize = new EventEmitter<number>();
  @Output() stoneSize = new EventEmitter<number>();
  @Output() stoneShape = new EventEmitter<String>();
  @Output() isStep2= new EventEmitter<boolean>();

  ngOnInit() {
  }
  submit(e) {
    if(this._wristSize && this._stoneSize && this._stoneShape){
       this.wristSize.emit(this._wristSize);
       this.stoneSize.emit(this._stoneSize);
       this.stoneShape.emit(this._stoneShape);
       this.isStep2.emit(true);

    }  else{
      this.isError = true;
    }

  }
}
