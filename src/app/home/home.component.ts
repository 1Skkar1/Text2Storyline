import {Component, HostListener, OnInit} from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {VideoComponent} from "../video/video.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})

export class HomeComponent implements OnInit {
  public scroll: boolean;
  public page: string;
  public loading: boolean;
  public url: string;
  public doStuff: string;
  public requestMade: boolean;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.loading = false;
    this.requestMade = false;
    this.page = "1";
    this.scroll = false;
  }

  changeURL(event: string) {
    this.url = event
  }

  ngOnInit() {
    //this.openDialog();
  }

  openDialog() {
    this.dialog.open(VideoComponent, { height: "90%", width: "100%" });
  }

  changePage(page: string) {
    this.url = ""
    if (page == "1") {
      if (page == this.page) {
        this.doStuff += "1"
        this.router.navigate(["/"]).then();
      }
    }
    if (page == "2") {
      if (page == this.page) {
        this.url = ""
        this.page = "3"
        return
      }
    }
    console.log(page);
    this.page = page;
  }

  handleValueQuery(event: any) {
    this.url = event
  }

  handleLoaded(event: any) {
    this.loading = event
  }

  handleRequest(event: any) {
    this.requestMade = event
  }

  changeNarrToggle() {
    let x = (<HTMLInputElement>document.getElementById('narrTextToggle'))
    if (x.innerHTML === ' Narrativa') {
      x.innerHTML = ' Texto Livre'
      console.log('Texto Livre')
      this.router.navigate(['texto-livre']).then(r => '')
    }
    else {
      x.innerHTML = ' Narrativa'
      console.log('Query / URL')
      this.router.navigate(['']).then(r => '')
    }
  }

  @HostListener("document:scroll")
  scrollFunction() {
    let bannerLogo = (<HTMLInputElement>document.getElementById('bannerLogo'))
    if (document.body.scrollTop > 285 || document.documentElement.scrollTop > 285) {
      bannerLogo.style.display = "block"
    }
    else {
      bannerLogo.style.display = "none"
    }
  }
}
