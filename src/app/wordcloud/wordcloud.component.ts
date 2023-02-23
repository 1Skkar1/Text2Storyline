import { Component, Input, OnInit } from '@angular/core';
import { catchError, take, timeout } from 'rxjs/operators';
import { YakeService } from '../services/yake.service';

@Component({
  selector: 'app-wordcloud',
  templateUrl: './wordcloud.component.html',
  styleUrls: ['./wordcloud.component.css']
})

export class WordcloudComponent implements OnInit {
  @Input() args: any;
  @Input() queryType: string;
  @Input() multidocFiles: any;
  @Input() topTen: any;
  @Input() lang: string;

  public loading: boolean;
  public error: boolean;
  public keywords: any;
  public wordcloud: any;
  public words: Array<any>;

  constructor(
    private yake: YakeService
  )
  {
    this.wordcloud = "";
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    if(this.args){
      if (this.queryType == "single" || this.queryType == "freetext") {
        this.getWordCloudSingle()
      }
      else {
        this.getWordCloudMulti()
      }
    }
  }

  formatText(text) {
    let newText = text.replace(/<kw>/g, '')
    newText = newText.replace(/<\/kw>/g, '')
    newText = newText.replace(/<d>/g, '')
    newText = newText.replace(/<\/d>/g, '')
    return newText
  }

  getWords(text) {
    let words = this.formatText(text).split(" ")
    let wordMap = {}

    for (let i = 0; i < words.length; i++) {
      let currentWordCount = wordMap[words[i]];
      let count = currentWordCount ? currentWordCount : 0;
      wordMap[words[i]] = count + 1;
    }
    return wordMap;
  }

  getWordCloudSingle(){
    let text = this.formatText(this.args.TextNormalized)
    this.yake
      .getKeywords(text,3,20)
      .pipe(
        timeout(10000),
        catchError(err => {
          console.log('Yake Error: ', err);
          this.error = true;
          this.loading = false
          return " ";
        }),
        take(1))
      .subscribe((res) => {
        if(res){
          console.log(res)
          this.keywords = res.keywords
          this.yake
            .getWordCloud(this.keywords, this.lang)
            .pipe(
              timeout(10000),
              catchError(err => {
                console.log('WordCloud Error: ', err);
                this.error = true
                this.loading = false
                return " "
              }),
              take(1))
            .subscribe( (resWC) => {
              console.log(resWC)
              this.wordcloud = 'data:image/png;base64,' + resWC.wordcloudb64
              this.loading = false
            })
        }
      })
  }

  getWordCloudMulti(){
    let text = this.topTen.map(a => a.text).join(' ')

    this.yake
      .getKeywords(text,3,20)
      .pipe(
        timeout(10000),
        catchError(err => {
          console.log('Yake Error: ', err);
          this.error = true;
          this.loading = false
          return " ";
        }),
        take(1))
      .subscribe((res) => {
        if(res){
          console.log(res)
          this.keywords = res.keywords
          this.yake
            .getWordCloud(this.keywords, this.lang)
            .pipe(
              timeout(10000),
              catchError(err => {
                console.log('WordCloud Error: ', err);
                this.error = true;
                this.loading = false
                return " ";
              }),
              take(1))
            .subscribe( (resWC) => {
              console.log(resWC)
              this.wordcloud = 'data:image/png;base64,' + resWC.wordcloudb64
              this.loading = false
            })
        }
      })
  }
}
