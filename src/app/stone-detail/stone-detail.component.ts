import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { HttpParams } from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stone-detail',
  templateUrl: './stone-detail.component.html',
  styleUrls: ['./stone-detail.component.scss']
})
export class StoneDetailComponent implements OnInit {

  private routeSub: Subscription;
  stone;
  isLoading = true;
  uid: string;
  stoneID
  favID = -1;
  AttributeItems;
  modal ;
  isAdmin = false;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private api: ApiService,
              private modalService: NgbModal) { }

  ngOnInit() {
    if(localStorage.getItem('user_type')=="admin"){
      this.isAdmin = true;
    }
    this.uid = localStorage.getItem('uid')
    let params = new HttpParams();

    this.routeSub = this.route.params.subscribe(param => {
      this.getAttribute()
      this.stoneID = param.id;
      this.api.getStoneDetail(param.id).subscribe(
        data => {
          // @ts-ignore
          this.stone = data.result;
          this.isLoading = false;
          console.log(data)
        },
        error => {
          console.log(error)
        }

      );
      if (this.uid) {
        params = params.append('user', this.uid)
        params = params.append('Stone', param.id)
        this.api.getFbFav(params).subscribe(
          data => {
            // @ts-ignore
            if (data.result.count) {
              this.stone['fav'] = true
              // @ts-ignore
              this.favID = data.result.results[0].id
            }
            else {
              this.stone['fav'] = false
            }

            console.log(this.stone.fav)
          },
          error => {
            console.log(error)
          }

        );
      }
    });

  }
  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
  url(data) {
    if (data.stone_img) {
      return data.stone_img;
    }
    return "http://html-color.org/154360.jpg"
  }
  urlsm(data) {
    if (data) {
      return data;
    }
    return "../../assets/image/tmps.png"
  }

  addFav() {
    let params = new HttpParams();
    params = params.append('user', this.uid)
    params = params.append('Stone', this.stoneID)
    console.log(params)
    this.stone.fav =!this.stone.fav
    if (this.stone.fav) {
      this.addFaverite(this.uid, this.stoneID)

      console.log('ยังมะมีค่าบ')
    } else {
      console.log('ซ้ำค่าบ')
      this.delFav(this.favID);
    }

  }
  addFaverite(uid, stoneId) {
    console.log(uid)
    const formData = new FormData()
    formData.append('user', uid)
    formData.append('Stone', stoneId)
    this.api.postfbFav(formData).subscribe(
      data => {
        // @ts-ignore
        this.favID = data.result.id
        console.log(data)
      },
      error => {
        console.log(error)
      }

    );
  }

  delFav(id) {
    this.api.delfbFav(id).subscribe(
      data => {
        console.log(data)
      },
      error => {
        console.log(error)
      }
    )
  }
  getDescription(stone){
    if(stone.description){
      return stone.description
    }
    return '-'
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
  gotoStone(id){
    return this.router.navigate(['admin/edit/' + id])
  }
  open(content,stone) {
    this.stone = stone
    this.modal = this.modalService.open(content)
  }
  remove(id){

  }

}

