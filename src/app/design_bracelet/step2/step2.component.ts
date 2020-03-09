import {Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import { ApiService } from '../../service/api.service';
import { HttpParams } from '@angular/common/http';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver'
@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {
  @Input() wristSize: number;
  @Input() stoneSize: number;
  @Input() stoneShape: string;
  @Output() bracelet_img = new EventEmitter<any>();
  @Output() isStep3= new EventEmitter<boolean>();
  @Output() isStep1= new EventEmitter<boolean>();
  // @ts-ignore
  @ViewChild('bracelet') bracelet: ElementRef;

  math = Math;
  // _wristSize: number;
  // _stoneSize: number;
  // _stoneShape: string;

  radius: number;
  numOfStones: number;
  braceletImageFile:string;


  stoneItems = [];
  favStones = [];
  userStones = [];
  bubble = [{
    img: String,
    active: Boolean() ,
    index : Number

  }];
  isLoading = true;
  favID = [];
  row;
  favRow;
  isFav = false;
  isBubble = false;
  bubbleIndex;
  stoneSelect=[];
  stoneAll=[];
  wristsize
  isCheck  = false
  constructor(private api: ApiService,) {
  }

  ngOnInit() {
    this.wristsize = Number(this.wristSize).toFixed();

    // this.wristsize = this.wristSize.toFixed()
    this.calNumofStone();
    this.calRadius();
    this.getFavStone();
    this.getStoneItem();
    // this.wristsize = this.wristSize.toFixed()
  }

  counter(i: number) {
    return new Array(i + 1);
  }

  async setBubble(num) {
    this.bubble = this.counter(num - 1)
    console.log(this.bubble)
    // @ts-ignore
    this.bubble.fill({img: '../../assets/image/tmps.png', active: false, index: -1});
    console.log(this.bubble)


  }

  setActive = function(buttonName) {
    if (buttonName === 'btn2') {
      this.isFav = true;
    } else {
      this.isFav = false;
    }
    this.activeButton = buttonName;
  };
  isActive = function(buttonName) {
    return this.activeButton === buttonName;
  };

  calNumofStone(): void {
    const num = Math.ceil(this.wristSize * 10 / this.stoneSize);
    this.numOfStones = num;
    console.log('numofstone')
    this.setBubble(num)

  }

  // tslint:disable-next-line:ban-types
  calRadius(): String {
    const radius = Math.ceil(this.numOfStones / (Math.PI * 2));
    this.radius = radius;
    return radius.toString();
  }

  isCircle(a: number, b: number): number {
    const x = a - this.radius * 2;
    const y = b - this.radius * 2;
    if (x * x + y * y < Math.pow(this.radius * 2, 2) + 1) {
      return 1;
    }
    if (x * x + y * y === Math.pow(this.radius * 2, 2) + 1) {
      return 2;
    } else {
      return 0;
    }
  }

  logevent(e) {
    console.log(e);
  }

  getStoneItem(param?) {
    this.api.getStone(param).subscribe(
      data => {
        this.stoneItems = data.result.results;
        this.isLoading = false;
        this.row = Math.ceil(data.result.count / 5);
        const res = data.result.results;
        console.log(res);
        const count = data.result.count;
        this.stoneItems.map((ras, index) => {
          res[index]['num'] = 0;
          if (this.userStones.includes(ras.id)) {
            this.favStones.push(ras);
            console.log(res);
          }
          if (index === count - 1) {
            this.isLoading = false;
            this.favRow = Math.ceil(this.favStones.length / 5);
            console.log(this.favStones);
          }

        });
        // console.log(data.results[1],this.row)
        console.log(data.result);
      },
      error => {
        console.log(error);
      }
    );


  }

  urlsm(data) {
    if (data) {
      return data;
    }
    return '../../assets/image/tmps.png';
  }

  getFavStone() {
    let params = new HttpParams();
    params = params.append('user', localStorage.getItem('uid'));
    console.log(params);
    const uid = localStorage.getItem('uid');

    this.api.getFbFav(params).subscribe(
      data => {
        // @ts-ignore
        const ustonedata = data.result.results;
        ustonedata.forEach(element => {
          this.userStones.push(element.Stone);
          this.favID.push(element.id);
          console.log(element);
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  getStoneFav(id) {
    let params = new HttpParams();
    params = params.append('user', localStorage.getItem('uid'));
    console.log(params);
    const uid = localStorage.getItem('uid');
    const stoneId = id;
    this.api.getFbFav(params).subscribe(
      data => {
        // @ts-ignore
        const ustonedata = data.result.results;
        ustonedata.forEach(element => {
          this.userStones.push(element.Stone);
          this.favID.push(element.id);
          console.log(element);
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  onBubbleClick(index) {
    // this.bubble[0]['active'] = true;
    this.bubbleIndex = index;
    this.isBubble = true;
    if(this.bubble[index].active) {
      this.bubble.fill({ 'img': this.bubble[index].img , active: false , index : this.bubble[index].index}, index, index + 1)
    }else{
      this.bubble.fill({'img': this.bubble[index].img , active: true ,  index : this.bubble[index].index}, index, index + 1)
    }


    console.log(this.bubble);
  }

  getSrc(src) {
    // console.log(src)
    return src
    // console.log(src)

  }

  async onClickStone(stone,i) {
    this.isCheck = false;
    const img_src = stone.stone_img_sm;
    // let count =0;
    if (this.isBubble) {
      await this.bubble.forEach((value, index) => {
        if (value.active) {
          // count++;
          console.log(value);
          // var s = this.stoneSelect.findIndex(x => x.id == index);
          // console.log(s);
          // if (s > -1) {
          //   console.log(this.stoneSelect)
          // } else {
          //   this.stoneSelect.push({'id': index, 'stone': stone})
          // }
          var ind = Number(this.bubble[index].index)
          if(ind == -1){
            this.stoneItems[i]['num'] += 1
          }else{
            this.stoneItems[i]['num'] += 1
            this.stoneItems[ind]['num'] -= 1
          }

          this.bubble.fill({'img': img_src, 'active': true ,index: i}, index, index + 1)
        }
      });

      this.stoneAll = []
      console.log(this.stoneAll)
      // this.stoneSelect.forEach((value, index) => {
      //   var s = this.stoneAll.findIndex(x => x == value.stone);
      //   if(s==-1 ){
      //     this.stoneAll.push(value.stone);
      //   }
      //
      // })
      console.log(this.stoneAll)
    }
    console.log(stone)
  }

  convertToImage() {

  }
  next(){
    let braceletImageFile;
    console.log(this.bracelet.nativeElement)
    domtoimage.toPng(this.bracelet.nativeElement,{
      height: this.bracelet.nativeElement.offsetHeight,
      width: this.bracelet.nativeElement.offsetWidth*2
    }).then( (dataUrl) => {

      this.braceletImageFile = dataUrl;
      this.bracelet_img.emit(dataUrl);
      this.isStep3.emit(true);
      // console.log(dataUrl)
      // braceletImageFile = dataUrl;
    })
      .catch( (error) =>{
        this.braceletImageFile = error
        console.error('oops, something went wrong!', error);
      })

  }
  previous(){
    this.isStep1.emit(true);
  }
  selectAll(e){
    this.isCheck = ! this.isCheck
    // console.log(this.isCheck)
    if(this.isCheck){
      this.isBubble = true;
      this.bubble.map(value => value.active = true)
    }else {
      this.bubble.map(value => value.active = false)
    }

  }
}
