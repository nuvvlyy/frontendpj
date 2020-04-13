import {Component, ElementRef, OnInit} from '@angular/core';
import {ApiService} from '../../service/api.service';
import {HttpClient} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {forEach} from '@angular-devkit/schematics';
import {datepickerAnimation} from 'ngx-bootstrap/datepicker/datepicker-animations';
import {json} from 'express';
import { TSMap } from "typescript-map";

interface Stone {
  stone_name_th:string;
  stone_name_en:string;
  chemical_formula:string;
  ancient_name:string;
  element:string;
  color:string;
  description:string;
  star:any;
  attribute: any;
  stone_img:any;
  stone_img_sm:any;
  notusewith:any;
  zodiac:any,
  day_of_week:any
}
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  stoneItem
  modal ; NgbModalRef;
  stone_id;
  private routeSub: Subscription;
  isLoading = true
  stone = {} as Stone;
  temp_stone:Stone[] =[];
  text;
  star;
  attributeItems;
  modules = {
    placeholder: 'Insert text here ...',
    modules:{
      formula: true,
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        // [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline',{ script: 'sub' }, { script: 'super' }],
        [{ align: new Array<any>() }],

        [{ color: new Array<any>() }],
        ['clean'],
      ]}
  };
  modules2 = {
    placeholder: 'Insert text here ...',
    modules:{
      formula: true,
      toolbar: [
        ['bold', 'italic', 'underline',{ script: 'sub' }, { script: 'super' }],

        ['clean'],
      ]}
  };
  day_of_week =[{id:0,name:"วันจันทร์"},
    {id: 1,name:"วันอังคาร"},
    {id: 2,name:"วันพุธ"},
    {id: 7,name:"วันพุธกลางคืน"},
    {id: 3,name:"วันพฤหัส"},
    {id: 4,name:"วันศุกร์"},
    {id: 5,name:"วันเสาร์"},
    {id: 6,name:"วันอาทิตย์"},
  ];

  fileData: File = null;
  previewUrl:any = null;
  previewUrl2:any = null;
  formdata = new FormData();
  stone_notuse:any;
  zodiacItem
  stoneEdit = new TSMap();


  constructor(private api: ApiService,
              private http: HttpClient,
              private elementRef: ElementRef,
              private modalService: NgbModal,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) {
  }
  ngOnInit() {
    if(localStorage.getItem('user_type')!="admin"){
      return this.router.navigate(['/admin/login']);
    }
    this.getZodiacItem()
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '' ;
    this.getStar();
    this.getAttributeList();
    this.routeSub = this.route.params.subscribe(param => {
      this.stone_id =param.id;
      this.api.getStone().subscribe(
        data => {
          let ind = data.result.results.findIndex(data=>data.id == this.stone_id);
          this.stone_notuse =data.result.results[ind].notusewith
          this.stone = data.result.results[ind]
          this.temp_stone[0] = this.stone
          this.stoneItem = data.result.results;
          this.stoneItem.splice(ind,1);
          // @ts-ignore
          if(this.stone.stone_img){
            // @ts-ignore
            this.previewUrl = this.stone.stone_img;
          }
          // @ts-ignore
          if(this.stone.stone_img_sm){
            // @ts-ignore
            this.previewUrl2 = this.stone.stone_img_sm;
          }
          this.isLoading = false;
          console.log(this.stoneItem)
        },
        error => {
          console.log(error)
        }

      );
    })
  }
  getZodiacItem(){
    this.api.getZodiac().subscribe(value => {
      this.zodiacItem = value['result'].results
    })
  }


  getAttributeList(){
    this.api.getAttribute().subscribe(
      data => {
        // @ts-ignore
        this.attributeItems = data.result.results;
        // this.isLoading = false;
        // console.log(data.result.results)
      },
      error => {
        console.log(error);
      }

    );
  }

  fileProgress(fileInput: any,i:number) {
    this.fileData = <File>fileInput.target.files[0];
    // i==1 ? this.stone.stone_img = this.fileData : this.stone.stone_img_sm = this.fileData ;
    i==1 ? this.formdata.append('stone_img',this.fileData)  : this.formdata.append('stone_img_sm',this.fileData) ;
    this.preview(i);
  }

  preview(i:number) {
    // Show preview

    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      i==1 ? this.stoneEdit.set('stone_img', reader.result)  : this.stoneEdit.set('stone_img_sm',reader.result) ;

      // console.log(reader.result)
      // this.selectedFile = new ImageSnippet(event.target.result, file);
      i==1 ? this.previewUrl = reader.result : this.previewUrl2 = reader.result ;
    }
  }

  getStar(){
    this.api.getStar().subscribe(value => {
      this.star = value['result'].results;
    })
  }
  onSubmit(){
    this.api.editStone(this.stone_id,this.stoneEdit.toJSON()).subscribe(value =>{

      let remove= this.stone_notuse.filter(x => !this.stone.notusewith.includes(x))
        let  add = this.stone.notusewith.filter(x => !this.stone_notuse.includes(x));
        console.log(this.stone.notusewith);
        console.log(this.stone_notuse);
        console.log(add);
        console.log(remove);
        for (let addKey in add) {
          let stone = {
            // @ts-ignore
            notusewith : [value.result.id]
          };
          this.api.editStone(add[addKey],JSON.stringify(stone)).subscribe(value1 => {
            console.log(value1);
          })
        }
        for (let removeKey in remove) {
          let i = this.stoneItem.findIndex((element) => element.id == remove[removeKey]);
          let j = this.stoneItem[i].notusewith.findIndex((element) => element == this.stone_id);
          this.stoneItem[i].notusewith.splice(j, 1);
          console.log(this.stoneItem[i].notusewith)
          let stone = {
            // @ts-ignore
            notusewith : this.stoneItem[i].notusewith
          };
          this.api.editStone(remove[removeKey],JSON.stringify(stone)).subscribe(value1 => {
            console.log(value1);
          })
        }
        // @ts-ignore
        this.openSnackBar("แก้ไขข้อมูลหิน "+value.result.stone_name_th+" เรียบร้อยแล้ว",value.result.id)
// console.log(value)
        this.modal = this.modalService.dismissAll()
    }
      // console.log(value)
    )
  }
  open(content) {
    this.modal = this.modalService.open(content)
  }
  onChange(name,value){

    if(name == "description"){
      this.stoneEdit.set(name,value);
      this.stoneEdit.set("dis_description",value.text);
    }else
      this.stoneEdit.set(name,value);
    console.log(value)

  }
  onChangeDis($event){
    // console.log($event)
      this.stoneEdit.set("description",$event.html);
      this.stoneEdit.set("dis_description",$event.text);

  }
  openSnackBar(massage,id) {
    let snackBarRef = this.snackBar.open(massage,"ดู",{
      duration: 4000,
    });
    snackBarRef.onAction().subscribe(value => {
      this.router.navigate(['/detail/' + id])
    })
  }
  cancel(){
    this.modal = this.modalService.dismissAll()
    // this.stone = this.temp_stone
    console.log(this.temp_stone)
    console.log(this.stone_notuse)
  }

}
