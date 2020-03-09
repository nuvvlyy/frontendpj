import { ApiService } from '../../service/api.service';
import { FileUploader, FileLikeObject } from 'ng2-file-upload';
import { concat } from  'rxjs';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {colors} from '@angular/cli/utilities/color';
import {NgbModalRef, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

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
  logChange($event) {
    this.stone.description =$event.html
    console.log(this.editor);
    console.log($event);
  }

  constructor(private api: ApiService,
              private http: HttpClient,
              private elementRef: ElementRef,
              private modalService: NgbModal,
              private router: Router,
              private snackBar: MatSnackBar) {
  }
  ngOnInit() {
    if(localStorage.getItem('user_type')!="admin"){
      return this.router.navigate(['/admin/login']);
    }
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '' ;
    this.getStar();
    this.getAttributeList();
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
    i==1 ? this.stone.stone_img = this.fileData : this.stone.stone_img_sm = this.fileData ;
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
      // this.selectedFile = new ImageSnippet(event.target.result, file);
      i==1 ? this.previewUrl = reader.result : this.previewUrl2 = reader.result ;
    }
  }

  getStar(){
    this.api.getStar().subscribe(value => {
      this.star = value['result'].results
      this.stone.star =value['result'].results[0]
      console.log(this.stone.star)
    })
  }
  onChange(){
    console.log(this.stone.attribute);
  }

  onSubmit(){

    var form_data = new FormData();
    for ( var key in this.stone ) {
      form_data.append(key, this.stone[key]);
    }
    this.api.postStone(form_data).subscribe(value =>{

      console.log(value)
      // @ts-ignore
      // this.stone.id = value.result.id;
      //@ts-ignore
        this.openSnackBar("เพิ่มหิน "+value.result.stone_name_th+" เรียบร้อยแล้ว",value.result.id)
      this.stone= {} as Stone;
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

}


