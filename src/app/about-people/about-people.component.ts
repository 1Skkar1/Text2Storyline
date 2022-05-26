import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import * as data from '../../assets/dataPeople.json';
import {VideoComponent} from "../video/video.component";

@Component({
  selector: 'app-about-people',
  templateUrl: './about-people.component.html',
  styleUrls: ['./about-people.component.css']
})
export class AboutPeopleComponent implements OnInit {
  public data: any;

  constructor(
    public dialog: MatDialog,
    private router: Router
  ) {
    this.data = data
    this.data = this.data.default.data
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
