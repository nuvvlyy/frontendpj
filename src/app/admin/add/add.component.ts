import { ApiService } from '../../service/api.service';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { concat } from  'rxjs';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {colors} from '@angular/cli/utilities/color';
import {NgbModalRef, NgbModal, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

interface Stone {
  stone_name_th:any;
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
  dis_description:string;
  zodiac:string;
  day_of_week:any
}
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})

export class AddComponent implements OnInit {




  // @ts-ignore
  @ViewChild('editor') editor;



  // selectStar;
  // selectAttribute;
  modal ; NgbModalRef

  stone = {} as Stone;
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
  fileData: File = null;
  previewUrl:any = null;
  previewUrl2:any = null;
  stoneItem;
  zodiacItem;

  day_of_week =[{id:0,name:"วันจันทร์"},
    {id: 1,name:"วันอังคาร"},
    {id: 2,name:"วันพุธ"},
    {id: 7,name:"วันพุธกลางคืน"},
    {id: 3,name:"วันพฤหัส"},
    {id: 4,name:"วันศุกร์"},
    {id: 5,name:"วันเสาร์"},
    {id: 6,name:"วันอาทิตย์"},
  ];
  logChange($event) {
    this.stone.description = $event.html
    this.stone.dis_description = $event.text
    console.log(this.editor);
    console.log($event);
  }

  constructor(private api: ApiService,
              private http: HttpClient,
              private elementRef: ElementRef,
              private modalService: NgbModal,
              private router: Router,
              private snackBar: MatSnackBar,
              private  date: NgbDateParserFormatter,) {
  }
  ngOnInit() {
    if(localStorage.getItem('user_type')!="admin"){
      return this.router.navigate(['/admin/login']);
    }
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '' ;
    this.getStar();
    this.getAttributeList();
    this.getStoneItem();
    this.getZodiacItem();
  }

  getStoneItem(){
    this.api.getStone().subscribe(
      data => {
        this.stoneItem = data.result.results;

      },
      error => {
        console.log(error)
      }

    );
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
        console.log(this.fileData)
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
      // console.log(reader.result)
      i==1 ? this.stone.stone_img = reader.result : this.stone.stone_img_sm = reader.result;

      // this.selectedFile = new ImageSnippet(event.target.result, file);
      i==1 ? this.previewUrl = reader.result : this.previewUrl2 = reader.result ;
    }
  }
  getZodiacItem(){
    this.api.getZodiac().subscribe(value => {
      this.zodiacItem = value['result'].results
    })
  }

  getStar(){
    this.api.getStar().subscribe(value => {
      this.star = value['result'].results
      this.stone.star = 1
    })
  }
  onChange(){
    console.log(this.stone.attribute);
  }

  onSubmit(){

    this.api.postStone(JSON.stringify(this.stone)).subscribe(value =>{
      let stonenotuse = this.stone.notusewith;
        console.log(this.stone.notusewith)
        for (let stonenotuseKey in stonenotuse) {
          let stone = {
            // @ts-ignore
            notusewith : [value.result.id]
          }
          this.api.editStone(stonenotuseKey,JSON.stringify(stone)).subscribe(value1 => {
            console.log(value1);
          })
        }
        // @ts-ignore
      this.openSnackBar("เพิ่มหิน "+value.result.stone_name_th+" เรียบร้อยแล้ว",value.result.id)
      this.stone= {} as Stone;
        this.previewUrl = null
        this.previewUrl2 = null;
      this.modal = this.modalService.dismissAll()
    }
    )
  }
  open(content) {
    this.modal = this.modalService.open(content)
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
    this.modal = this.modalService.dismissAll();
    this.stone = null;
  }


}


