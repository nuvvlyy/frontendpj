import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit {
  @Input() bracelet_img;
  // @ts-ignore
  @ViewChild('downloadLink') downloadLink: ElementRef;
  constructor() { }

  ngOnInit() {
    console.log(this.bracelet_img)
  }
  onDownload(){
    this.downloadLink.nativeElement.href = this.bracelet_img;
    this.downloadLink.nativeElement.download = 'template_bracelet.png';
    this.downloadLink.nativeElement.click();
  }

}
