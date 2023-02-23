import { Component, HostListener, Renderer2 } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Router } from '@angular/router';
import * as data from '../../assets/dataPeople.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  public data: any;
  public windowWidth: any;
  public lang: any = 'pt';
  public burgerToggle = false;

  constructor(
    private translate: TranslateService,
    private renderer: Renderer2,
    private router: Router
  ) {
    if (this.router.getCurrentNavigation().extras.state !== undefined) {
      this.lang = this.router.getCurrentNavigation().extras.state;
    }
    translate.use(this.lang);
    this.windowWidth = window.screen.width;
    this.data = data
    this.data = this.data.default.data
  }

  changeNarrToggle1() {
    if (this.windowWidth <= 768) {
      this.toggleHamburger()
    }
    let x = (<HTMLInputElement>document.getElementById('narrToggle'))
    if (this.lang == 'pt') {
      if (x.innerHTML === 'Narrativa') {
        x.innerHTML = 'Texto Livre'
        this.router.navigateByUrl('', { state: this.lang }).then(r => '')
      }
      else {
        x.innerHTML = 'Narrativa'
        this.router.navigateByUrl('/texto-livre', { state: this.lang }).then(r => '')
      }
    }

    else if (this.lang == 'en') {
      if (x.innerHTML === 'Narrative') {
        x.innerHTML = 'Free Text'
        this.router.navigateByUrl('', { state: this.lang }).then(r => '')
      }
      else {
        x.innerHTML = 'Narrative'
        this.router.navigateByUrl('/texto-livre', { state: this.lang }).then(r => '')
      }
    }
  }

  changeNarrToggle2() {
    if (this.windowWidth <= 768) {
      this.toggleHamburger()
    }
    let x = (<HTMLInputElement>document.getElementById('freetextToggle'))
    if (this.lang == 'pt') {
      if (x.innerHTML === 'Narrativa') {
        x.innerHTML = 'Texto Livre'
        this.router.navigateByUrl('', { state: this.lang }).then(r => '')
      }
      else {
        x.innerHTML = 'Narrativa'
        this.router.navigateByUrl('/texto-livre', { state: this.lang }).then(r => '')
      }
    }

    else if (this.lang == 'en') {
      if (x.innerHTML === 'Narrative') {
        x.innerHTML = 'Free Text'
        this.router.navigateByUrl('', { state: this.lang }).then(r => '')
      }
      else {
        x.innerHTML = 'Narrative'
        this.router.navigateByUrl('/texto-livre', { state: this.lang }).then(r => '')
      }
    }
  }

  changeAbout() {
    if (this.windowWidth <= 768) {
      this.toggleHamburger()
    }
    this.router.navigateByUrl('/sobre', { state: this.lang }).then(r => '')
  }

  changeLang() {
    if (this.lang == 'pt') {
      this.lang = 'en'
      this.translate.use(this.lang)
    }
    else {
      this.lang = 'pt'
      this.translate.use(this.lang)
    }
  }

  @HostListener("document:scroll")
  scrollActions() {
    let header = (<HTMLInputElement>document.getElementById('header'))
    header.classList.toggle("scrolled", window.pageYOffset > 0);
  }

  toggleHamburger() {
    let header = (<HTMLInputElement>document.getElementById('header'))
    header.classList.toggle("open");
    header.classList.toggle("stopScrolling");

    if (this.burgerToggle) {
      this.renderer.removeClass(document.body, 'open');
      this.renderer.removeClass(document.body, 'stopScrolling');
      this.burgerToggle = false
    }

    else {
      this.renderer.addClass(document.body, 'open');
      this.renderer.addClass(document.body, 'stopScrolling');
      this.burgerToggle = true
    }
  }
}
