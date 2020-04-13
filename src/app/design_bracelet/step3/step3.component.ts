import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ApiService} from '../../service/api.service';
import {valueReferenceToExpression} from '@angular/compiler-cli/src/ngtsc/annotations/src/util';
import {HttpParams} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit {
  @Input() bracelet_img;
  @Input() bracelet;
  @Input() wristSize: number;
  @Input() stoneSize: number;
  @Input() numOfStones: number;
  @Output() isStep2 = new EventEmitter<boolean>();
  // @ts-ignore
  @ViewChild('downloadLink') downloadLink: ElementRef;
  uid
  modal
  nameOfPattern
  name
  isError = false
  constructor(private api: ApiService,
              private modalService: NgbModal,) { }

  ngOnInit() {
    if (localStorage.getItem('uid')) {
      this.uid = localStorage.getItem('uid');
    }
    if (localStorage.getItem('pattern')) {
      console.log(localStorage.getItem('pattern'));
    }
    let stoneList = [];
    this.bracelet.forEach((value) =>{
      stoneList.push(value.stone_id)
    });
    let data ={
      stoneList: stoneList,
      NumOfStones:this.numOfStones,
      wristSize:this.wristSize,
      stoneSize:this.stoneSize,
      user_id:this.uid,
      name_pattern:null
    }
    localStorage.setItem('pattern',JSON.stringify(data))
    // console.log(this.bracelet_img)
  }
  onDownload(){
    localStorage.getItem('first_name')? this.name = localStorage.getItem('first_name'):
      this.name ="unknow";
    this.downloadLink.nativeElement.href = this.bracelet_img;
    this.downloadLink.nativeElement.download = this.name +'_bracelet.png';
    this.downloadLink.nativeElement.click();
  }
  onSave(){
    if(this.nameOfPattern){
      let stoneList = [];
      this.bracelet.forEach((value) =>{
        stoneList.push(value.stone_id)
      });
      console.log(stoneList)
      let data ={
        stoneList: stoneList,
        NumOfStones:this.numOfStones,
        wristSize:this.wristSize,
        stoneSize:this.stoneSize,
        user_id:this.uid,
        name_pattern:this.nameOfPattern
      }

      this.api.addBraceletPattern(JSON.stringify(data)).subscribe(value => {
        console.log(value)
      })
      this.modalService.dismissAll();
    }else{
  this.isError = true
    }


  }
  open(content) {
    this.modal = this.modalService.open(content)
  }
  previous() {
    this.isStep2.emit(true);
  }

}
