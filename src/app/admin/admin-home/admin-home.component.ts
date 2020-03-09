import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../service/api.service'
import { Router } from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  modal ;
  stoneItems;
  isLoading:boolean = true;
  stone

  constructor(private api:ApiService,
              private router: Router,
              private modalService: NgbModal,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    if(localStorage.getItem('user_type')!="admin"){
      return this.router.navigate(['/admin/login']);
    }
    this.getStoneItem();
  }

  getStoneItem(param?){
    this.api.getStone(param).subscribe(
      data=>{
        this.stoneItems = data.result.results;
        this.isLoading = false;
        console.log(data)
      },
      error=>{
        console.log(error)
      }

    );
   console.log(this.stoneItems)

  }
  url(data){
    if(data.stone_img) {
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
redirect(id: string) {
  // console.log(id)
  this.router.navigate(['/detail/' + id]);
}
itemSelected(event){
  this.redirect(event.id);

}
remove(id){
  this.api.delStone(id).subscribe(
    data=>{
      location.reload();
      this.openSnackBar("ลบหิน"+this.stone.stone_name_th+ "เรียบร้อยแล้ว")
    }
  )
}
  open(content,stone) {
    this.stone = stone
    this.modal = this.modalService.open(content)
  }
  openSnackBar(massage) {
    this.snackBar.open(massage,null,{
      duration: 4000,
    });
  }

}
