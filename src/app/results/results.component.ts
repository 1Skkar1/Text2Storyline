import { Component, Input, OnChanges } from '@angular/core';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})

export class ResultsComponent implements OnChanges {
  @Input() score: any;
  @Input() args: any;
  @Input() sortBy: string;
  @Input() entitiesMatter: boolean;
  @Input() multidocDates: any;
  @Input() multidocScores: any;
  @Input() queryType: string;
  @Input() wiki: any;

  public singleNarr: boolean;
  public multiLen: number;
  public multidocFiles: any;
  public multidocDecoy: any;
  public multidocSpliced: any;
  public wikiData: [{
    title: string;
    url: string;
    class: string;
    image: string;
    text: string;
  }];

  constructor() {
    // @ts-ignore
    this.wikiData = [];
    this.singleNarr = false;
  }

  ngOnChanges() {
    //this.markWikiData()
    this.displayMultiple()
  }

  OnPageChange(event: PageEvent) {
    console.log(event)
    const startIndex = event.pageIndex * event.pageSize
    let endIndex = startIndex + event.pageSize
    if (endIndex > this.multiLen) {
      endIndex = this.multiLen
    }
    console.log(startIndex)
    console.log(endIndex)
    console.log(this.multidocFiles)
    console.log(this.multidocDecoy)
    this.multidocSpliced = this.multidocDecoy.splice(startIndex, endIndex)
    console.log(this.multidocFiles)
    this.multidocDecoy = this.multidocFiles
    console.log(this.multidocDecoy)
  }

  displayMultiple() {
    if (this.sortBy == "dates") {
      this.multidocFiles = this.multidocDates
      this.multidocDecoy = this.multidocFiles
      this.multidocSpliced = this.multidocDecoy.splice(0,10)
      this.multiLen = this.multidocFiles.map(a => a.title).length
    }
    else {
      this.multidocFiles = this.multidocScores
      this.multidocDecoy = this.multidocFiles
      this.multidocSpliced = this.multidocDecoy.splice(0,10)
      this.multiLen = this.multidocFiles.map(a => a.title).length
    }
  }

  startSingleDoc(url) {
    console.log("STARTING SINGLE DOC: " + url)
    this.singleNarr = true;
  }

  openArquivo(url) {
    window.open(url, '_blank');
  }
}
