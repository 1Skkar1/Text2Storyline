import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import * as data from '../../assets/dataThanks.json';
import {VideoComponent} from "../video/video.component";

@Component({
  selector: 'app-about-refs',
  templateUrl: './about-refs.component.html',
  styleUrls: ['./about-refs.component.css']
})
export class AboutRefsComponent implements OnInit {
  public data: any;
  public data1: any;
  public data2: any;

  constructor(
    public dialog: MatDialog,
    private router: Router
  ) {
    this.data = data
    this.data1 = this.data.default.data1
    this.data2 = this.data.default.data2
  }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(VideoComponent, { height: "90%", width: "100%" });
  }

  changeNarrToggle() {
    let x = (<HTMLInputElement>document.getElementById('narrTextToggle'))
    setTimeout (() => {
      if (x.innerHTML === 'Query / URL') {
        x.innerHTML = 'Texto Livre'
        console.log('Texto Livre')
        this.router.navigate(['texto-livre']).then(r => '')
      }
      else {
        x.innerHTML = 'Query / URL'
        console.log('Query / URL')
        this.router.navigate(['']).then(r => '')
      }
    }, 250);
  }
}
