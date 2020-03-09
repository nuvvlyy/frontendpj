/* tslint:disable:no-shadowed-variable variable-name */
import {Component, HostListener, Inject, OnInit} from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { NgbDateStruct, NgbCalendar , NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';
import { Title }     from '@angular/platform-browser';
import {TooltipPosition} from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
declare var FB: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations:[
    trigger('fade',
      [
        state('void', style({ opacity : 0})),
        transition(':enter',[ animate(300)]),
        transition(':leave',[ animate(500)]),
      ]
    )]
})
export class HomeComponent implements OnInit {


  stoneItems;
  isLoading = true;
  AttributeItems;
  dateOfBirth;
  gender;
  userStones = [];
  favID = [];
  searchStone;
  haveUser = false;
  uDateOfBirth;
  modelChanged: Subject<string> = new Subject<string>();
  isChanged;
  // tslint:disable-next-line:max-line-length
  month = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม',
          'มิถุนายน', 'กรกฏาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม' ];
  uDate;
  type = [];
  dateOfBirth_display;
  searchItem = new Map();
  attribute
  isDisplay = false;
  isSearchError = false;

  isOpen: boolean = false
  isLogined: boolean = false
  frist_name
  isDisplayNavbar = false;
  isDisplayed: boolean = false
  constructor(private api: ApiService,
              private router: Router,
              private calendar: NgbCalendar,
              private  date: NgbDateParserFormatter,
              private http: HttpClient,
              private titleService: Title,
              private snackBar: MatSnackBar,
              @Inject(DOCUMENT) document) {
      this.modelChanged.pipe(
        debounceTime(800))
        .subscribe(model => {
          console.log(model);
          if (model.toString().length==1){
            this.isSearchError = true
            this.searchItem.delete('search');
            return ;
          }
          if (model.toString().length==0){
            this.searchItem.delete('search');
            this.isSearchError = false;
            this.search();
            return ;
          }
          this.isSearchError = false;
          this.searchItem.set('search',model);

          this.search();
        });
     }

  ngOnInit() {
    console.log(this.isLogined)
    this.frist_name = localStorage.getItem('first_name');
    if(localStorage.length<1 ) {

      this.isLogined = true;
    }
    this.isDisplayed = true;
    if (localStorage.getItem('uid')) {
      this.getStoneFav(localStorage.getItem('uid'));
      this.haveUser = true;
      this.getDate();
    }
    this.getStoneItem();
    this.getAttribute();
    this.setTitle('home');
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset > 500) {
      this.isDisplayNavbar = true
      let element = document.getElementById('navbar');
      element.classList.add('sticky');
    } else {
      this.isDisplayNavbar = false;
      let element = document.getElementById('navbar');
      element.classList.remove('sticky');
    }
  }
  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
  public setTitle( newTitle: string) {
    this.titleService.setTitle( newTitle );
  }

  getStoneItem(param?) {
    this.api.getStone(param).subscribe(((
      data => {

        console.log(data);
        const count = data.result.count;
        const  res = data.result.results;
        if (localStorage.getItem('uid')) {
          res.map((ras, index) => {
            if (this.userStones.includes(ras.id)) {
              ras.fav = true;
            } else {
              ras.fav = false;
            }
            if (index === count - 1) {
              this.stoneItems = res;
              this.isLoading = false;
            }

          });

        } else {
          this.stoneItems = data.result.results;
          this.isLoading = false;

        }
        if (count === 0) {
          this.stoneItems = null;
          this.isLoading = false;
        }

      }
    )));
  }

  redirect(id: string) {
    // console.log(id)
    this.router.navigate(['/detail/' + id]);
  }

  getAttribute() {
    this.api.getAttribute().subscribe(
      data => {
        // @ts-ignore
        this.AttributeItems = data.result.results;
        // this.isLoading = false;
        // console.log(data.result.results)
      },
      error => {
        console.log(error);
      }

    );
  }
  url(data) {
    if (data) {
      return data;
    }
    return 'http://html-color.org/154360.jpg';
  }

  search(param?) {
    this.isDisplay = true
    let params = new HttpParams();
    if (this.searchItem.get('dateOfBirth')) {
      const str = this.dateOfBirth.year + this.dateOfBirth.month.toString() + this.dateOfBirth.day.toString();
      const number = this.digSum(str).toString();
      const BD = new Date(this.dateOfBirth.year, this.dateOfBirth.month - 1, this.dateOfBirth.day);

      this.dateOfBirth_display = 'วันที่ ' + this.dateOfBirth.day + ' เดือน ' + this.month[this.dateOfBirth.month - 1] + ' ปี ' + (Number(this.dateOfBirth.year)+543);
      // this.searchItem.push("วันเกิด : ​"+this.dateOfBirth_display)
      const param = new HttpParams();
      params = params.append('day_of_week', BD.getDay().toString())
              .append('day_of_mouth', BD.getDate().toString())
              .append('number', number)
              .append('month_of_year', BD.getMonth().toString());

      // day_of_week=8&day_of_mouth=&number=&month_of_year=
    }
    this.isLoading = true;

    if (this.searchItem.get('search')) {
      params = params.append('search', this.searchItem.get('search'));
      // this.searchItem.set("search",param)
    }
    // this.type.forEach(element => {
    //   params = params.append('start', element)


    // });
    if(this.attribute){
      params = params.append('attribute',this.attribute)

    }
    console.log(params)
    this.getStoneItem(params);
  }

  digSum(n: number) {
    if (n === 0) {
      return 0;
    }
    return (n % 9 === 0) ? 9 : (n % 9);
  }
  addFav(id, i) {
    let params = new HttpParams();
    params = params.append('user', localStorage.getItem('uid'));
    params = params.append('Stone', id);
    console.log(params);
    const uid = localStorage.getItem('uid');
    const stoneId = id;
    const fid = this.userStones.indexOf(stoneId);
    this.stoneItems[i].fav = ! this.stoneItems[i].fav;
    if(this.stoneItems[i].fav){
      this.openSnackBar("เพิ่มหินเข้ารายการโปรดแล้ว")
    }else{
      this.openSnackBar("นำหินออกจากรายการโปรดแล้ว")
    }
    if (fid === -1) {

      this.addFaverite(uid, stoneId);


    } else {

      this.delFav(this.favID[fid]);
    }

  }
  addFaverite(uid, stoneId) {
    console.log(uid);

    const formData = new FormData();
    formData.append('user', uid );
    formData.append('Stone', stoneId);
    this.api.postfbFav(formData).subscribe(
      data => {
        // @ts-ignore
        this.userStones.push(data.Stone);
        // @ts-ignore
        this.favID.push(data.id);
        console.log(data);
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
  delFav(id) {

    this.api.delfbFav(id).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }
  onSearchStonechange(event) {
    this.modelChanged.next(this.searchStone);
  }
  checkValue(event) {
    this.isChanged = event.currentTarget.checked;
    if (event.currentTarget.checked) {
      this.dateOfBirth = this.uDateOfBirth;
      this.searchItem.set('dateOfBirth', this.uDateOfBirth)
    } else {
      this.dateOfBirth = null;
    }
  }
  getDate() {
    const date = localStorage.getItem('dob').split('/');
    const d = date[2] + '-' + date[0] + '-' + date[1];
    this.uDateOfBirth = this.date.parse(d);
    // console.log(this.uDateOfBirth);
    const year = Number(date[2]) + 543;
    this.uDate = 'วันที่ ' + this.uDateOfBirth.day + ' เดือน ' + this.month[this.uDateOfBirth.month - 1] + ' ปี ' + year;
    this.uDateOfBirth = this.date.parse(d);
  }

  urlsm(data) {
    if (data) {
      return data;
    }
    return '../../assets/image/tmps.png';
  }
  getType(params) {
    const BD = new Date(this.dateOfBirth.year, this.dateOfBirth.month - 1, this.dateOfBirth.day);
    const day = BD.getDate().toString();
    const month = BD.getMonth().toString();
    this.api.getStar(params).subscribe(
      data => {
        // @ts-ignore
        const r = data.result.results;
        r.forEach(element => {
          this.type.push(element.id);
          console.log(element);
          console.log(this.type);

        });


      },
      error => {
        console.log(error);
      }

    );
  }
  changedSearchItems(key){
    if(key=='dateOfBirth'){
      this.dateOfBirth = null;
    }
    if(key=='attribute'){
      this.attribute = null;
    }
    this.searchItem.delete(key)

     this.search()
  }
  displayValue(key){
    if(key == 'dateOfBirth'){
      console.log(this.searchItem.get('dateOfBirth'))
      return 'วันเดือนปีเกิด : วันที่ ' + this.searchItem.get('dateOfBirth').day +
              ' เดือน ' + this.month[this.searchItem.get('dateOfBirth').month - 1] +
              ' ปี ' + (Number(this.searchItem.get('dateOfBirth').year)+543)

    }
    if(key == 'search'){
      return 'คำค้นหา : '+this.searchItem.get('search')
    }
    if(key == 'attribute'){
      let str = "";
      let attributes= this.searchItem.get('attribute');
      // console.log(attributes)
      for (let i = 0 ; i < attributes.length;i++) {
        str += this.AttributeItems.find(t=>t.id == attributes[i]).attribute_name
        if( i <attributes.length-1){
          str+= " , "
        }
      }
      return 'เรื่องที่ต้องการเสริม : '+str
    }
  }
  openSnackBar(massage) {
    this.snackBar.open(massage,null,{
      duration: 4000,
    });
  }
  onClear(){
    if(this.searchItem.has('attribute')){
      this.searchItem.delete('attribute')
    }
  }
  reset(){
    this.searchItem.clear()
      this.dateOfBirth = null;
      this.attribute = null;

  }
  openManu(){
    this.isOpen = ! this.isOpen
  }
  getIsLogined(){
    return this.isLogined
  }
  logOut(){

    localStorage.clear();
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }



}
