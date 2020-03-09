import {Component, ElementRef, OnInit} from '@angular/core';
import {ApiService} from '../../service/api.service';
import {HttpClient} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  modal ; NgbModalRef;
  stone_id;
  private routeSub: Subscription;
  isLoading = true
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
  formdata = new FormData();
  logChange($event) {
    this.stone.description =$event.html
    // console.log(this.editor);
    console.log($event);
  }

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
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '' ;
    this.getStar();
    this.getAttributeList();
    this.routeSub = this.route.params.subscribe(param => {
      this.stone_id =param.id;
      this.api.getStoneDetail(param.id).subscribe(
        data => {
          // @ts-ignore
          this.stone = data.result;
          this.isLoading = false;
          // @ts-ignore
          if(data.result.stone_img){
            // @ts-ignore
            this.previewUrl = data.result.stone_img;
          }
          // @ts-ignore
          if(data.result.stone_img_sm){
            // @ts-ignore
            this.previewUrl2 = data.result.stone_img_sm;
          }
          // @ts-ignore
          // if(data.result.star){
          //   // @ts-ignore
          //   this.stone.star = data.result.star.id
          // }
          console.log(data)
        },
        error => {
          console.log(error)
        }

      );
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
    // console.log(this.formdata)
    // this.formdata.forEach((value1, key) => {
    //   console.log(value1,key)
    // })
    // var form_data = new FormData();
    // for ( var key in this.stone ) {
    //   form_data.append(key, this.stone[key]);
    // }
    this.api.editStone(this.stone_id,this.formdata).subscribe(value =>{
        // @ts-ignore
        this.openSnackBar("แก้ไขข้อมูลหิน "+value.result.stone_name_th+" เรียบร้อยแล้ว",value.result.id)

        this.modal = this.modalService.dismissAll()
    }
      // console.log(value)
    )
  }
  open(content) {
    this.modal = this.modalService.open(content)
  }
  onChange(name,value){
    this.formdata.append(name,value)

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
