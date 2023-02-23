import { Component, Input, OnInit } from "@angular/core";
import { WikifierService } from "../services/wikifier.service";
import { ArquivoService } from "../services/arquivo.service";
import { catchError, take, timeout } from "rxjs/operators";

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.css']
})

export class EntitiesComponent implements OnInit {
  @Input() errorWikifier: boolean;
  @Input() text: any;
  @Input() summary: Array<string>;
  @Input() queryType: string;
  @Input() wiki: any;
  @Input() lang: string;

  public loading: boolean;
  public error: boolean;
  public wikiEmpty: boolean;
  public sumCounter: number;
  public finalLength: number;
  public wikiTagTexts: Array<string>;
  public wikiTexts: Array<string>;
  public wikiTagImages: Array<string>;
  public wikiImages: Array<string>;
  public wikiData: [{
    title: string;
    url: string;
    class: string;
    image: string;
    text: string;
  }];

  constructor(
    private wikifier: WikifierService,
    private arquivo: ArquivoService
  ) {
    this.loading = false;
    this.error = false;
    this.wikiEmpty = false;
    this.sumCounter = 0;
    this.wikiTagTexts = [];
    this.wikiTexts = [];
    this.wikiImages = [];
    this.wikiTagImages = [];
    // @ts-ignore
    this.wikiData = [];
  }

  ngOnInit() {
    this.error = this.errorWikifier

    if (!this.error) {
      this.getWikify();
    }
  }

  formatText(text) {
    let newText = text.replace(/<kw>/g, '')
    newText = newText.replace(/<\/kw>/g, '')
    newText = newText.replace(/<d>/g, '')
    newText = newText.replace(/<\/d>/g, '')
    return newText
  }

  getWikify() {
    let finalText: string
    this.loading = true
    this.wikification()

    if (this.queryType == "single" || this.queryType == 'freetext') {
      finalText = this.formatText(this.text)
    }
    else {
      finalText = this.formatText(Object.values(this.text).slice(0,10).join(' '))
    }
  }

  wikification() {
    let maxRank = 0
    let minRank = 1
    let totRank = 0
    let avgRank: number
    let multiLen = 0

    if (this.queryType == "single" || this.queryType == 'freetext') {
      for (let i = 0; i < this.wiki.annotations.length; i++) {
        let pageRank = this.wiki.annotations[i].pageRank
        if (pageRank < minRank) {
          minRank = pageRank
        }
        if (pageRank > maxRank) {
          maxRank = pageRank
        }
        totRank += pageRank
      }
      let try1 = this.wiki.annotations.length / 1.75
      avgRank = totRank / try1

      for (let i = 0; i < this.wiki.annotations.length && this.wikiData.length < 50; i++) {
        let pageRank = this.wiki.annotations[i].pageRank
        //console.log(this.wiki.annotations[i].title + ": " + pageRank)
        if (pageRank > avgRank) {
          if (this.wiki.annotations[i].wikiDataClasses?.length > 0) {
            if (this.wiki.annotations[i]?.wikiDataClasses[0]?.enLabel != 'year'
              && this.wiki.annotations[i]?.wikiDataClasses[0]?.enLabel != 'calendar year'
              && this.wiki.annotations[i]?.wikiDataClasses[0]?.enLabel != 'common year'
              && this.wiki.annotations[i]?.wikiDataClasses[0]?.enLabel != 'point in time with respect to recurrent timeframe') {
              let data = {
                "title": this.wiki.annotations[i].title,
                "url": this.wiki.annotations[i].url,
                "class": this.wiki.annotations[i].wikiDataClasses[0].enLabel,
                "image": "",
                "text": ""
              }
              this.wikiData.push(data)
            }
          }
          else {
            let data = {
              "title": this.wiki.annotations[i].title,
              "url": this.wiki.annotations[i].url,
              "class": "-",
              "image": "",
              "text": ""
            }
            this.wikiData.push(data)
          }
        }
      }
    }

    else {
      for (let i = 0; i < this.wiki.length; i++) {
        multiLen += this.wiki[i].annotations.length
        for (let j = 0; j < this.wiki[i].annotations.length; j++) {
          let pageRank = this.wiki[i].annotations[j].pageRank
          if (pageRank < minRank) {
            minRank = pageRank
          }
          if (pageRank > maxRank) {
            maxRank = pageRank
          }
          totRank += pageRank
        }
      }
      let try1 = multiLen / 2.5
      avgRank = totRank / try1

      for (let i = 0; i < this.wiki.length; i++) {
        for (let j = 0; j < this.wiki[i].annotations.length && this.wikiData.length < 50; j++) {
          let wikiTitle = this.wikiData.map(a => a.title)
          let pageRank = this.wiki[i].annotations[i].pageRank
          //console.log(this.wiki[i].annotations[i].title + ": " + pageRank)
          if (pageRank > avgRank) {
            if (!wikiTitle.includes(this.wiki[i].annotations[j].title)) {
              if (this.wiki[i].annotations[j].wikiDataClasses?.length > 0) {
                if (this.wiki[i].annotations[j]?.wikiDataClasses[0]?.enLabel != 'year'
                  && this.wiki[i].annotations[j]?.wikiDataClasses[0]?.enLabel != 'calendar year'
                  && this.wiki[i].annotations[j]?.wikiDataClasses[0]?.enLabel != 'common year'
                  && this.wiki[i].annotations[j]?.wikiDataClasses[0]?.enLabel != 'point in time with respect to recurrent timeframe') {
                  let data = {
                    "title": this.wiki[i].annotations[j].title,
                    "url": this.wiki[i].annotations[j].url,
                    "class": this.wiki[i].annotations[j].wikiDataClasses[0].enLabel,
                    "image": "",
                    "text": ""
                  }
                  this.wikiData.push(data)
                }
              }
              else {
                let data = {
                  "title": this.wiki[i].annotations[j].title,
                  "url": this.wiki[i].annotations[j].url,
                  "class": "",
                  "image": "",
                  "text": ""
                }
                this.wikiData.push(data)
              }
            }
          }
        }
      }
    }
    this.getWiki()
  }

  getWiki() {
    let iCount = 0
    let jCount = 0

    // @ts-ignore
    if (this.wikiData.length == 0) {
      this.loading = false
      this.wikiEmpty = true
    }

    for (let i = 0; i < this.wikiData.length; i++) {
      this.wikifier
        .getWikiText(this.wikiData[i].title, this.lang)
        .pipe(
          timeout(50000),
          catchError(err => {
            console.log('MediaWiki Text Error: ', err);
            //this.error = true
            //this.loading = false
            return " "
          }),
          take(1))
        .subscribe((res1) => {
          if (res1) {
            //console.log(res1)
            let text = typeof res1?.query?.pages[Object.keys(res1.query.pages)[0]]?.extract != 'undefined' ? res1.query.pages[Object.keys(res1.query.pages)[0]].extract : ""
            let tagText = res1?.query?.pages[Object.keys(res1.query.pages)[0]]?.title
            this.wikiTexts.push(text.split(' ').slice(0,30).join(' ') + '...')
            this.wikiTagTexts.push(tagText)
            iCount++
            if (iCount == this.wikiData.length) {
              for (let j = 0; j < this.wikiData.length; j++) {
                this.arquivo
                  .getImgURL(this.wikiData[j].title)
                  .pipe(
                    timeout(50000),
                    catchError(err => {
                      console.log('Arquivo Image Error: ', err);
                      this.error = true
                      this.loading = false
                      return " "
                    }),
                    take(1))
                  .subscribe((res2) => {
                    if (res2.numberOfResponseItems > 0) {
                      //console.log(res2)
                      let image = res2.responseItems[0].imgLinkToArchive
                      let tagImage = this.wikiData[j].title
                      this.wikiImages.push(image)
                      this.wikiTagImages.push(tagImage)
                      jCount++
                      if (jCount ==  this.wikiData.length) {
                        this.arrangeWikiData()
                      }
                    }
                    else {
                      this.wikifier
                        .getWikiImage(this.wikiData[j].title, this.lang)
                        .pipe(
                          timeout(50000),
                          catchError(err => {
                            console.log('MediaWiki Image Error: ', err);
                            //this.error = true
                            //this.loading = false
                            return " "
                          }),
                          take(1))
                        .subscribe((res2) => {
                          if (res2) {
                            //console.log(res2)
                            let hasImage = res2?.query?.pages[Object.keys(res2.query.pages)[0]]?.thumbnail?.source || 0
                            if (hasImage != 0) {
                              let image = res2.query.pages[Object.keys(res2.query.pages)[0]].thumbnail.source
                              let tagImage = res2.query.pages[Object.keys(res2.query.pages)[0]].title
                              this.wikiImages.push(image)
                              this.wikiTagImages.push(tagImage)
                            }
                            else {
                              let image = "../../assets/Default_Entity_ENG.jpg"
                              let tagImage = res2.query.pages[Object.keys(res2.query.pages)[0]].title
                              this.wikiImages.push(image)
                              this.wikiTagImages.push(tagImage)
                            }
                            jCount++
                            if (jCount ==  this.wikiData.length) {
                              this.arrangeWikiData()
                            }
                          }
                        });
                    }
                  });
              }
            }
          }
        });
    }
  }

  arrangeWikiData() {
    for (let i = 0; i < this.wikiData.length; i++) {
      let indexText = this.wikiTagTexts.indexOf(this.wikiData[i].title)
      let indexImage = this.wikiTagImages.indexOf(this.wikiData[i].title)
      this.wikiData[i] = {
        "title": this.wikiData[i].title,
        "url": this.wikiData[i].url,
        "class": this.wikiData[i].class,
        "image": this.wikiImages[indexImage],
        "text": this.wikiTexts[indexText]
      }
    }
    this.loading = false
  }

  openWikiLink(url) {
    window.open(url, '_blank');
  }
}
