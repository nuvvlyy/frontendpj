import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-faverite',
  templateUrl: './faverite.component.html',
  styleUrls: ['./faverite.component.scss']
})
export class FaveriteComponent implements OnInit {


  userStones =[]
  stoneItems =[]
  favID=[]
  isLoading = true
  constructor(private router: Router,
    private api: ApiService) { }

  ngOnInit() {
    if(localStorage.length <1 ){
     this.router.navigate(['/home'])
    }else{
      this.getStoneFav(localStorage.getItem('uid'))
      this.getStoneItem()
    }
  }
  url(data) {
    if (data) {
      return data;
    }
    return "http://html-color.org/154360.jpg"
  }
  getStoneItem(param?){
    this.api.getStone(param).subscribe(((
      data => {
        console.log(data)
        const count = data.result.count
        let  res = data.result.results;

        if(localStorage.getItem('uid')){
          res.map((ras,index)=>{
              if (this.userStones.includes(ras.id)){
                ras.fav = true;
                this.stoneItems.push(ras)
                console.log(res)
              }
              if(index==count-1){
                  this.isLoading = false
                }

          })

        }else{
          this.router.navigate(['/home'])

        }


      }
    )));
  }
  getStoneFav(id){
    let params = new HttpParams();
    params = params.append('user', localStorage.getItem('uid'))
    console.log(params)
    const uid = localStorage.getItem('uid')
    const stoneId = id
    this.api.getFbFav(params).subscribe(
      data => {
        // @ts-ignore
        const ustonedata = data.result.results
        ustonedata.forEach(element => {
          this.userStones.push(element.Stone)
          this.favID.push(element.id)
          console.log(element)
        });
      },
      error => {
        console.log(error)
      }

    );
  }
  delFav(id){
    this.api.delfbFav(id).subscribe(
      data => {
      },
      error => {
        console.log(error)
      }
    )
  }
  addFaverite(uid,stoneId){
    console.log(uid)
    const formData = new FormData()
    formData.append('user', uid )
    formData.append('Stone', stoneId)
    this.api.postfbFav(formData).subscribe(
      data => {
        // @ts-ignore
        this.userStones.push(data.Stone)
        // @ts-ignore
        this.favID.push(data.id)
        console.log(data)
      },
      error => {
        console.log(error)
      }

    );
  }
  addFav(id,i) {
    let params = new HttpParams();
    params = params.append('user', localStorage.getItem('uid'))
    params = params.append('Stone', id)
    console.log(params)
    const uid = localStorage.getItem('uid')
    const stoneId = id
    const fid = this.userStones.indexOf(stoneId)
    this.stoneItems[i].fav = ! this.stoneItems[i].fav
    if(fid==-1){
      this.addFaverite(uid,stoneId)

      console.log('ยังมะมีค่าบ')
    }else{
      console.log('ซ้ำค่าบ')
      this.stoneItems.splice(i,1);
      this.delFav(this.favID[fid]);
    }

  }
  itemSelected(event){
    this.redirect(event.id);

  }
  redirect(id: string) {
    // console.log(id)
    this.router.navigate(['/detail/' + id]);
  }
  urlsm(data) {
    if (data) {
      return data;
    }
    return "../../assets/image/tmps.png"
  }


}
