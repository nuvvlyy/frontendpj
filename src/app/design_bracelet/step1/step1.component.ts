import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../../service/api.service';
import {HttpParams} from '@angular/common/http';

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

  modal ; NgbModalRef
  constructor(
    private modalService: NgbModal,
    private api: ApiService,) {
  }
  uid;
  braceletPattern
  ngOnInit() {
    if (localStorage.getItem('uid')) {
      this.uid = localStorage.getItem('uid');
      this.getBraceletPattern(this.uid);

    }

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
  getBraceletPattern(id){
    let params = new HttpParams();
    params.append("user_id", id);
    this.api.getBraceletPattern(params).subscribe(value => {
      // @ts-ignore
      this.braceletPattern = value.result.results
    })
  }
  open(content) {
    this.modal = this.modalService.open(content)
  }
  selectBraceletPattern(pattern){
    this.modal = this.modalService.dismissAll();
    localStorage.setItem('pattern',JSON.stringify(pattern));
    this.wristSize.emit(pattern.wristSize);
    this.stoneSize.emit(pattern.stoneSize);
    this.stoneShape.emit(this._stoneShape);
    this.isStep2.emit(true);
  }
}
