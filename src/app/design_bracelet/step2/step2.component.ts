import {Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import {ApiService} from '../../service/api.service';
import {HttpParams} from '@angular/common/http';
import domtoimage from 'dom-to-image';
import {saveAs} from 'file-saver';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

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
  @Output() isStep3 = new EventEmitter<boolean>();
  @Output() isStep1 = new EventEmitter<boolean>();
  // @ts-ignore
  @ViewChild('bracelet') bracelet: ElementRef;

  math = Math;
  // _wristSize: number;
  // _stoneSize: number;
  // _stoneShape: string;

  radius: number;
  numOfStones: number;
  braceletImageFile: string;


  stoneItems = [];
  favStones = [];
  userStones = [];
  bubble = [{
    img: String,
    active: Boolean(),
    index: Number

  }];
  isLoading = true;
  favID = [];
  row;
  favRow;
  isFav = false;
  isBubble = false;
  bubbleIndex;
  stoneSelect = [];
  stoneAll = [];
  wristsize;
  isCheck = false;
  uid;
  stoneSuggest = [];
  sRow;
  activeButton = 'btn1';

  constructor(private api: ApiService,
              private  date: NgbDateParserFormatter,) {
  }

  ngOnInit() {
    this.wristsize = Number(this.wristSize).toFixed();

    // this.wristsize = this.wristSize.toFixed()
    this.calNumofStone();
    this.calRadius();
    if (localStorage.getItem('uid')) {
      this.uid = localStorage.getItem('uid');
      this.getFavStone();
      this.getDate();
      const str = this.getDate().year + this.getDate().month.toString() + this.getDate().day.toString();
      const number = this.digSum(Number(str)).toString();
      const BD = new Date(this.getDate().year, this.getDate().month - 1, this.getDate().day);
      let params = new HttpParams();
      params = params.append('day_of_week', BD.getDay().toString())
        .append('day_of_mouth', BD.getDate().toString())
        .append('number', number)
        .append('month_of_year', BD.getMonth().toString());
      this.getStoneSuggest(params);
    }

    this.getStoneItem();
    // this.wristsize = this.wristSize.toFixed()
  }

  counter(i: number) {
    return new Array(i + 1);
  }

  async setBubble(num) {
    this.bubble = this.counter(num - 1);
    console.log(this.bubble);
    // @ts-ignore
    this.bubble.fill({img: '../../assets/image/tmps.png', active: false, index: -1});
    console.log(this.bubble);


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
    console.log('numofstone');
    this.setBubble(num);

  }

  // tslint:disable-next-line:ban-types
  calRadius(): String {
    const radius = Math.ceil(this.numOfStones / (Math.PI * 2));
    this.radius = radius;
    return radius.toString();
  }


  getStoneItem() {
    this.api.getStone().subscribe(
      data => {
        this.stoneItems = data.result.results;
        this.isLoading = false;
        this.row = Math.ceil(data.result.count / 5);
        const res = data.result.results;
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

  getStoneSuggest(param) {
    this.api.getStone(param).subscribe(value => {
      this.stoneSuggest = value.result.results;
      // const count = value.result.count;
      this.sRow = Math.ceil(value.result.count / 5);
    });
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
    // const uid = localStorage.getItem('uid');

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
    if (this.bubble[index].active) {
      this.bubble.fill({'img': this.bubble[index].img, active: false, index: this.bubble[index].index}, index, index + 1);
    } else {
      this.bubble.fill({'img': this.bubble[index].img, active: true, index: this.bubble[index].index}, index, index + 1);
    }


    console.log(this.bubble);
  }

  getSrc(src) {
    // console.log(src)
    return src;
    // console.log(src)

  }

  async onClickStone(stone, i) {
    this.isCheck = false;
    const img_src = stone.stone_img_sm;
    if (this.activeButton == 'btn2' || this.activeButton == 'btn3') {
      i = Number(this.stoneItems.findIndex((value, index) => value.id == stone.id));
      // console.log(i)
    }
      // let count =0;
    if (this.isBubble) {
      await this.bubble.forEach((value, index) => {

        if (value.active) {
          // count++;
          var ind = Number(this.bubble[index].index);
          if (ind == -1) {
            this.stoneItems[i]['num'] += 1;
          } else {
            this.stoneItems[i]['num'] += 1;
            this.stoneItems[ind]['num'] -= 1;
          }

          this.bubble.fill({'img': img_src, 'active': false, index: i}, index, index + 1);
        }
      });

      this.stoneAll = [];
      console.log(this.stoneAll);
      // this.stoneSelect.forEach((value, index) => {
      //   var s = this.stoneAll.findIndex(x => x == value.stone);
      //   if(s==-1 ){
      //     this.stoneAll.push(value.stone);
      //   }
      //
      // })
      console.log(this.stoneAll);
    }
    console.log(stone);
  }

  convertToImage() {

  }

  next() {
    let braceletImageFile;
    console.log(this.bracelet.nativeElement);
    domtoimage.toPng(this.bracelet.nativeElement, {
      height: this.bracelet.nativeElement.offsetHeight,
      width: this.bracelet.nativeElement.offsetWidth * 2
    }).then((dataUrl) => {

      this.braceletImageFile = dataUrl;
      this.bracelet_img.emit(dataUrl);
      this.isStep3.emit(true);
      // console.log(dataUrl)
      // braceletImageFile = dataUrl;
    })
      .catch((error) => {
        this.braceletImageFile = error;
        console.error('oops, something went wrong!', error);
      });

  }

  previous() {
    this.isStep1.emit(true);
  }

  selectAll(e) {
    this.isCheck = !this.isCheck;
    // console.log(this.isCheck)
    if (this.isCheck) {
      this.isBubble = true;
      this.bubble.map(value => value.active = true);
    } else {
      this.bubble.map(value => value.active = false);
    }

  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  shuffle() {
    let n = this.activeButton == 'btn2' ? this.favStones.length : this.activeButton == 'btn1' ? this.stoneItems.length : this.stoneSuggest.length;
    console.log(this.numOfStones);
    for (let i = 0; i < this.numOfStones;) {
      let num = this.getRandomInt(0, n);
      if (this.activeButton == 'btn1') {
        if (this.stoneItems[num].stone_img_sm) {

          var ind = Number(this.bubble[i].index);
          this.bubble.fill({'img': this.stoneItems[num].stone_img_sm, 'active': false, index: num}, i, i + 1);
          if (ind == -1) {
            this.stoneItems[num]['num'] += 1;
          } else {
            this.stoneItems[num]['num'] += 1;
            this.stoneItems[ind]['num'] -= 1;
          }
          i++;
        }
      } else if (this.activeButton == 'btn2') {
        if (this.favStones[num].stone_img_sm) {

          let indx = Number(this.stoneItems.findIndex((value, index) => value.id == this.favStones[num].id));
          var ind = Number(this.bubble[i].index);
          // @ts-ignore
          this.bubble.fill({'img': this.favStones[num].stone_img_sm, 'active': false, index: Number(indx)}, i, i + 1);
          if (ind == -1) {
            this.stoneItems[indx]['num'] += 1;
          } else {
            this.stoneItems[indx]['num'] += 1;
            this.stoneItems[ind]['num'] -= 1;
          }
          i++;
        }
      } else if (this.activeButton == 'btn3') {
        if (this.stoneSuggest[num].stone_img_sm) {
          let indx = Number(this.stoneItems.findIndex((value, index) => value.id == this.stoneSuggest[num].id));
          var ind = Number(this.bubble[i].index);
          // @ts-ignore
          this.bubble.fill({'img': this.stoneSuggest[num].stone_img_sm, 'active': false, index: Number(indx)}, i, i + 1);
          if (ind == -1) {
            this.stoneItems[indx]['num'] += 1;
          } else {
            this.stoneItems[indx]['num'] += 1;
            this.stoneItems[ind]['num'] -= 1;
          }
          i++;
        }
      }

    }

  }

  getDate() {
    const date = localStorage.getItem('dob').split('/');
    const d = date[2] + '-' + date[0] + '-' + date[1];
    return this.date.parse(d);
  }

  digSum(n: number) {
    if (n === 0) {
      return 0;
    }
    return (n % 9 === 0) ? 9 : (n % 9);
  }


}
