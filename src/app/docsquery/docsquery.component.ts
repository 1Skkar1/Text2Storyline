import { Component, OnInit, Input, Output, EventEmitter, HostListener } from "@angular/core";
import { Router } from '@angular/router';
import { catchError, take, timeout } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { TimelineService } from "../services/timeline.service";
import { ArquivoService } from "../services/arquivo.service";
import { WikifierService } from "../services/wikifier.service";
import { GoogleTrendsService } from "../services/googletrends.service";
import * as data from "../../assets/data.json";
import { throwError } from "rxjs";
import {VideoComponent} from "../video/video.component";

@Component({
  selector: 'app-docsquery',
  templateUrl: './docsquery.component.html',
  styleUrls: ['./docsquery.component.css']
})

export class DocsQueryComponent implements OnInit {
  @Output() loaded: EventEmitter<any> = new EventEmitter();
  @Output() queryValue: EventEmitter<any> = new EventEmitter();
  @Output() requestMake: EventEmitter<any> = new EventEmitter();

  public windowWidth: any;
  public currentYear: any;
  public currentDate: any;
  public trending: Array<any>;
  public top: Array<any>;
  public queryType: string;
  public isQueried: boolean;
  public url: string;
  public art: any;
  public algorithmOptions: Array<any>;
  public algorithmSelected: string;
  public dateGranularityOptions: Array<string>;
  public dateGranularitySelected: string;
  public documentTypeOptions: Array<any>;
  public documentTypeSelected: string;
  public languageOptions: Array<string>;
  public languageSelected: string;
  public dateBegin: number;
  public dateEnd: number;
  public maxValTH: number;
  public numberOfKeyWords: number;
  public contextWindow: number;
  public contextFullSentence: boolean;
  public simbaValue: number;
  public simbaValueMax: boolean;
  public cheating: boolean;
  public showOnlyRel: boolean;
  public ngramSelected: number;
  public scoringOptions: Array<string>;
  public scoringSelected: string;
  public hiddenOptionKW: boolean;
  public hiddenOption: boolean;
  public requestMade: boolean;
  public loading: boolean;
  public loading2: boolean;
  public loadingTrends1: boolean;
  public loadingTrends2: boolean;
  public documentCreationTime: string;
  public timelineOptions: any;
  public scheduler: any;
  public result: any;
  public resultArquivo: any;
  public resultTimeMatters: any;
  public TH: number;
  public change: boolean;
  public oops: boolean;
  public old: string;
  public hiddenOptionTM: boolean;
  public right: string;
  public errorAPI: string;
  public errorCode: string;
  public errorWikifier: boolean;
  public errorPublico1: string;
  public errorPublico2: string;
  public errorPublico3: string;
  public avoidCheck: Array<string>;
  public data: any;
  public data_carousel: any;
  public domains: Array<string>;
  public arquivoOptions: {
    domains: Array<string>;
    maxItems: string;
    lastYears: string;
    title: string;
    snippet: string;
    fullContent: string;
    newspaper3k: string;
  };
  public typeOptions: string[];
  public typeSelected: string;
  public multidocFiles: [{
    "title": string,
    "snippet": string,
    "url": string,
    "tempOG": any,
    "tempExpressions": any,
    "tempScores": any
  }];
  public multidocDates: [{
    "title": string,
    "snippet": string,
    "url": string,
    "tempOG": any,
    "tempExpressions": any,
    "tempScores": any
  }];
  public multidocScores: [{
    "title": string,
    "snippet": string,
    "url": string,
    "tempOG": any,
    "tempExpressions": any,
    "tempScores": any
  }];
  public urls: Array<string>;
  public snippets: Array<string>;
  public dates: Array<any>;
  public indexes: Array<any>;
  public url_5: Array<string>;
  public summary: Array<any>;
  public wiki: any;
  public dbpedia: any;
  public topTen: any;

  @Input() inp: any;
  @Input() doStuff: string;

  constructor(
    private timeline: TimelineService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private arquivo: ArquivoService,
    private wikifier: WikifierService,
    private googletrends: GoogleTrendsService,
    private router: Router
  ) {
    this.windowWidth = window.screen.width;
    this.currentYear = new Date().getFullYear();
    this.queryType = "";
    this.url = "";
    this.isQueried = false;
    this.algorithmOptions = [
      [
        "py_heideltime",
        "makes use of Heideltime temporal tagger to detect a range of different temporal expressions",
      ],
      [
        "py_rule_based",
        "a simple rule-based approach that only takes into account dates in the format of dddd (e.g., 2021)",
      ],
    ];
    this.dateGranularityOptions = ["full", "year", "month", "day"];
    this.documentTypeOptions = [
      ["news", "news-style documents (document creation time should be provided whenever possible)"],
      ["narrative", "narrative-style documents (e.g., Wikipedia articles)"],
      ["colloquial", "non-standard language (e.g., tweets or SMS)"],
      ["scientific", "documents with a local time frame (e.g., clinical trials)"]
    ];
    this.languageOptions = [
      "auto-detect",
      "English",
      "Portuguese",
      "Spanish",
      "German",
      "Dutch",
      "Italian",
      "French",
    ];
    this.scoringOptions = ["doc", "corpus", "sentence", "docsentence"]
    this.domains = [
      'publico.pt',
      'dn.pt',
      'dnoticias.pt',
      'rtp.pt',
      'cmjornal.pt',
      'iol.pt',
      'tvi24.iol.pt',
      'noticias.sapo.pt',
      'sapo.pt',
      'expresso.sapo.pt',
      'sol.sapo.pt',
      'jornaldenegocios.pt',
      'abola.pt',
      'jn.pt',
      'sicnoticias.sapo.pt',
      'lux.iol.pt',
      'ionline.pt',
      'news.google.pt',
      'dinheirovivo.pt',
      'aeiou.pt',
      'tsf.pt',
      'meiosepublicidade.pt',
      'sabado.pt',
      'economico.sapo.pt'
    ]
    this.typeOptions = ["pdf", "ps", "html", "xls", "ppt", "doc", "rtf"]
    this.typeSelected = this.typeOptions[0]
    this.arquivoOptions = {
      "maxItems": "20",
      "domains": this.domains,
      "lastYears": "10",
      "title": "True",
      "snippet": "True",
      "fullContent": "False",
      "newspaper3k": "False"
    };
    this.avoidCheck = ['de', 'a', 'o', 'que', 'e', 'é', 'do', 'da', 'em', 'um', 'para', 'com', 'não', 'uma', 'os',
      'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'ao', 'ele', 'das', 'à', 'seu', 'sua', 'ou',
      'quando', 'muito', 'nos', 'já', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'depois',
      'sem', 'mesmo', 'aos', 'seus', 'quem', 'nas', 'me', 'esse', 'eles', 'você', 'essa', 'num', 'nem', 'suas', 'meu',
      'às', 'minha', 'numa', 'pelos', 'elas', 'qual', 'nós', 'lhe', 'deles', 'essas', 'esses', 'pelas', 'este', 'dele',
      'tu', 'te', 'vocês', 'vos', 'lhes', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'nosso', 'nossa', 'nossos',
      'nossas', 'dela', 'delas', 'esta', 'estes', 'estas', 'aquele', 'aquela', 'aqueles', 'aquelas', 'isto', 'aquilo',
      'estou', 'está', 'estamos', 'estão', 'estive', 'esteve', 'estivemos', 'estiveram', 'estava', 'estávamos',
      'estavam', 'estivera', 'estivéramos', 'esteja', 'estejamos', 'estejam', 'estivesse', 'estivéssemos',
      'estivessem', 'estiver', 'estivermos', 'estiverem', 'hei', 'há', 'havemos', 'hão', 'houve', 'houvemos',
      'houveram', 'houvera', 'houvéramos', 'haja', 'hajamos', 'hajam', 'houvesse', 'houvéssemos', 'houvessem',
      'houver', 'houvermos', 'houverem', 'houverei', 'houverá', 'houveremos', 'houverão', 'houveria', 'houveríamos',
      'houveriam', 'sou', 'somos', 'são', 'era', 'éramos', 'eram', 'fui', 'foi', 'fomos', 'foram', 'fora', 'fôramos',
      'seja', 'sejamos', 'sejam', 'fosse', 'fôssemos', 'fossem', 'for', 'formos', 'forem', 'serei', 'será', 'seremos',
      'serão', 'seria', 'seríamos', 'seriam', 'tenho', 'tem', 'temos', 'tém', 'tinha', 'tínhamos', 'tinham', 'tive',
      'teve', 'tivemos', 'tiveram', 'tivera', 'tivéramos', 'tenha', 'tenhamos', 'tenham', 'tivesse', 'tivéssemos',
      'tivessem', 'tiver', 'tivermos', 'tiverem', 'terei', 'terá', 'teremos', 'terão', 'teria', 'teríamos', 'teriam'];
    this.errorPublico1 = "Ao atingir o limite de artigos do Público Online mostrou como é importante para si a excelência e qualidade do jornalismo em Portugal."
    this.errorPublico2 = "Assinatura Diária"
    this.errorPublico3 = "Ligue 760 10 50 20"
    this.cheating = false;
    this.hiddenOptionKW = false;
    this.hiddenOptionTM = false;
    this.hiddenOption = false;
    this.loading = false;
    this.loading2 = false;
    this.loadingTrends1 = true;
    this.loadingTrends2 = true;
    this.requestMade = false;
    this.oops = false;
    this.errorWikifier = false;
    this.change = false;
    this.right = "right";
    this.data = data;
    this.data = this.data.default.data;
    this.dates = [];
    this.indexes = [];
    this.url_5 = [];
    this.summary = [];
    // @ts-ignore
    this.multidocFiles = [];
    // @ts-ignore
    this.multidocDates = [];
    // @ts-ignore
    this.multidocScores = [];
    this.wiki = [];
    this.dbpedia = '';
    this.topTen = [];
  }

  ngOnInit(): void {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    this.currentDate = dd + '/' + mm + '/' + yyyy;
    this.oops = false;
    this.requestMade = false;
    this.requestMake.emit(this.requestMade);
    this.loaded.emit(this.loading);
    if (this.inp) {
      this.checkInput(this.inp) ? this.singleDocQuery() : this.multipleDocQuery()
    }
    else {
      this.url = ""
    }
    this.getTrends()
  }

  ngOnChanges() {
    if (this.doStuff) {
      this.resetValues();
    }
  }

  getTrends() {
    this.googletrends
      .getTrending("portugal", 20)
      .pipe(
        catchError(err => {
          console.log('Google Trends Trending Error: ', err);
          return throwError(err);
        }),
        take(1))
      .subscribe((res) => {
        console.log(res)
        if (res.result != undefined) {
          this.trending = res.result
          this.loadingTrends1 = false
          console.log(this.trending)
        }
      });
    this.googletrends
      .getTop("PT", 20)
      .pipe(
        catchError(err => {
          console.log('Google Trends Top Error: ', err);
          return throwError(err);
        }),
        take(1))
      .subscribe((res) => {
        console.log(res)
        if (res) {
          this.top = res.result
          this.loadingTrends2 = false
        }
      });
  }

  beginURL(event: any) {
    event.preventDefault();
    if(event.target.value){
      this.oops = false;
      this.inp = event.target.value;
      if (this.checkInput(this.inp)){
        this.url = this.inp
        this.queryValue.emit(this.url);
      }
    }
  }

  beginQuery(event: any) {
    this.requestMade = false;
    this.loading = true;
    this.loaded.emit(true);
    window.scroll(0, 0);
    if (typeof event === "string") {
      this.inp = event
    }
    if (!this.inp) {
      this.oops = true
      return
    }
    this.checkInput(this.inp) ? this.singleDocQuery() : this.multipleDocQuery()
  }

  beginCarouselQuery(event: any) {
    this.requestMade = false;
    this.loading = true;
    this.loaded.emit(true);
    window.scroll(0, 0);
    if (typeof event === "string") {
      this.inp = event
    }
    if (!this.inp) {
      this.oops = true
      return
    }
    this.checkInput(this.inp) ? this.singleDocQuery() : this.multipleDocQuery()
  }

  showDefaultArticle(value: string) {
    this.url = value;
    this.oops = false;
    this.showArticle();
  }

  checkInput(value: string) {
    let url_string;
    try {
      url_string = new URL(value);
    } catch (_) {
      return false;
    }
    return url_string.protocol === "http:" || url_string.protocol === "https:" ;
  }

  singleDocQuery() {
    this.queryType = "single"
    this.url = this.inp
    this.oops = false
    this.enableSettingsSD()
    this.showArticle()
  }

  enableSettingsSD() {
    //Py_Heideltime
    this.algorithmSelected = this.algorithmOptions[0][0];
    //ByDoc
    this.scoringSelected = this.scoringOptions[0];
    //Full
    this.dateGranularitySelected = this.dateGranularityOptions[0];
    //News
    this.documentTypeSelected = this.documentTypeOptions[0][0];
    //Portuguese
    this.languageSelected = this.languageOptions[2];
    this.dateBegin = 0;
    this.dateEnd = 2100;
    this.maxValTH = 1;
    this.numberOfKeyWords = 30;
    this.contextWindow = 1;
    this.contextFullSentence = true;
    this.simbaValueMax = true;
    this.simbaValue = 1;
    this.showOnlyRel = false;
    this.ngramSelected = 1;
    this.TH = 0.05;
  }

  showArticle() {
    if (this.inp) {
      this.queryType = "single"
      this.url = this.inp;
      this.queryValue.emit(this.url);
    }
    this.update();
    this.timeline
      .getTextKeyDateFromUrl(this.url, this.timelineOptions)
      .pipe(
        timeout(120000),
        catchError(err => {
          console.log('Time-Matters Error: ', err);
          this.oops = true
          this.errorAPI = err.name
          this.requestMade = false;
          this.requestMake.emit(this.requestMade);
          this.loading = false;
          this.loaded.emit(false);
          return " ";
        }),
        take(1))
      .subscribe((res) => {
        if (res.message === "success") {
          console.log(res)
          this.result = res;
          let finalText = this.formatText(this.result.TextNormalized).replace(new RegExp('%','g'),'');
          if (finalText.length >= 25000) {
            finalText = finalText.substring(0,24999)
          }
          this.wikifier
            .getWikifier(finalText)
            .pipe(
              timeout(150000),
              catchError(err => {
                console.log('Wikifier Error: ', err);
                this.errorWikifier = true;
                this.requestMade = true;
                this.update();
                this.loading = false;
                this.loaded.emit(false);
                this.isQueried = true;
                return " ";
              }),
              take(1))
            .subscribe((res) => {
              console.log(res)
              if (!res.error) {
                this.wiki = res;
              }
              else {
                //console.log("ERROR")
              }
              this.requestMade = true;
              this.update();
              this.loading = false;
              this.loaded.emit(false);
              this.isQueried = true;
              return " ";
            });
          //dbpedia
        }
        else {
          this.oops = true
          this.errorAPI = res.message
          this.errorCode = res.code
          this.requestMade = false;
          this.requestMake.emit(this.requestMade);
          this.loading = false;
          this.loaded.emit(false);
          return " ";
        }
      });
  }

  multipleDocQuery() {
    this.queryType = "multiple"
    this.url = ''
    this.oops = false
    // @ts-ignore
    this.multidocFiles = [];
    // @ts-ignore
    this.multidocDates = [];
    // @ts-ignore
    this.multidocScores = [];
    this.topTen = [];
    this.enableSettingsMD()
    this.getDocs()
  }

  enableSettingsMD() {
    //Rule_Based
    this.algorithmSelected = this.algorithmOptions[1][0];
    //ByCorpus
    this.scoringSelected = this.scoringOptions[1];
    //Full
    this.dateGranularitySelected = this.dateGranularityOptions[0];
    //News
    this.documentTypeSelected = this.documentTypeOptions[0][0];
    //Portuguese
    this.languageSelected = this.languageOptions[2];
    this.dateBegin = 0;
    this.dateEnd = 2100;
    this.maxValTH = 1;
    this.numberOfKeyWords = 30;
    this.contextWindow = 1;
    this.contextFullSentence = true;
    this.simbaValueMax = true;
    this.simbaValue = 1;
    this.showOnlyRel = false;
    this.ngramSelected = 1;
    this.TH = 0.05;
  }

  getDocs() {
    this.update();
    this.arquivo
      .getQuery(this.inp, this.arquivoOptions)
      .pipe(
        timeout(120000),
        catchError(err => {
          console.log('Time-Matters Error: ', err);
          this.oops = true
          this.errorAPI = err.name
          this._snackBar.open("Erro!", "Tente Novamente", {
            duration: 2000,
          });
          this.requestMade = false;
          this.requestMake.emit(this.requestMade);
          this.loading = false;
          this.loaded.emit(false);
          return " ";
        }),
        take(1))
      .subscribe((res) => {
        console.log(res)
        if (res.resultArquivo.message === "success") {
          this.resultArquivo = res.resultArquivo.result;
        }
        else {
          this.oops = true
          this.errorAPI = res.message
          this.errorCode = res.code
          this.requestMade = false;
          this.requestMake.emit(this.requestMade);
          this.loading = false;
          this.loaded.emit(false);
          return " ";
        }
        if (res.resultTimeMatters.message === "success") {
          this.resultTimeMatters = res.resultTimeMatters
          for (let i = 0; i < this.resultArquivo[1].length; i++) {
            let firstLine = this.resultArquivo[1][i].snippet.split('\n')[0]
            if (firstLine !== this.errorPublico1 && firstLine != this.errorPublico2 && firstLine != this.errorPublico3) {
              if (this.resultTimeMatters.TempExpressions[i]?.length > 0) {
                let temp = this.resultTimeMatters.TempExpressions[i]
                let tempExp = []
                for (let t = 0; t < temp.length; t++) {
                  tempExp = tempExp.concat(temp[t])
                }
                tempExp = [...new Set(tempExp)]
                let tempScores = []
                for (let k = 0; k < tempExp.length; k++) {
                  // USED FOR QUERY_DOC
                  tempScores.push(this.resultTimeMatters.Score[tempExp[k]][i][0])
                  // USED FOR QUERY_CORPUS
                  //tempScores.push(this.resultTimeMatters.Score[tempExp[k]][0])
                }
                for (let j = 0; j < tempScores.length; j++) {
                  if (tempScores[j] >= 0 && this.resultArquivo[1][i].title != "" && this.resultArquivo[1][i].snippet != "") {
                    let file = {
                      "title": this.resultArquivo[1][i].title,
                      "snippet": this.resultArquivo[1][i].snippet,
                      "url": this.resultArquivo[1][i].url,
                      "tempExpressions": [],
                      "tempOG": tempExp,
                      "tempScores": tempScores
                    }
                    this.multidocFiles.push(file)
                    break;
                  }
                }
              }
            }
          }
          //console.log(this.multidocFiles.map(a => a.title))
          //console.log(this.multidocFiles.map(a => a.snippet))
          //console.log(this.multidocFiles.map(a => a.url))
          //console.log(this.multidocFiles.map(a => a.summary3k))
          //console.log(this.multidocFiles.map(a => a.newspaper3k))
          //console.log(this.multidocFiles.map(a => a.tempExpressions))
          //console.log(this.multidocFiles.map(a => a.tempScores))
          //console.log(this.multidocFiles)

          // @ts-ignore
          //this.multidocFiles = [...new Map(this.multidocFiles.map(v => [JSON.stringify([v.title, v.snippet]), v])).values()]
          this.urls = this.multidocFiles.map(a => a.url)

          this.filterDates()
          this.filterScores()
          this.getTopTen()
          let counter = 0
          this.wiki = []

          for (let i = 0; i < this.topTen.length; i++) {
            let finalText = this.topTen[i].text.replace(new RegExp('%','g'),'');
            this.wikifier
              .getWikifier(finalText)
              .pipe(
                timeout(15000),
                catchError((err) => {
                  console.log('Wikifier Error: ', err);
                  this.errorWikifier = true;
                  this.requestMade = true;
                  this.result = this.resultTimeMatters;
                  this.update();
                  this.loading = false;
                  this.loaded.emit(false);
                  this.isQueried = true;
                  return ""
                }),
                take(1))
              .subscribe((res) => {
                console.log(res)
                if (!res.error) {
                  counter++;
                  this.wiki.push(res);
                  if (counter == this.topTen.length) {
                    console.log(this.wiki)
                    this.requestMade = true;
                    this.result = this.resultTimeMatters;
                    this.update();
                    this.loading = false;
                    this.loaded.emit(false);
                    this.isQueried = true;
                  }
                }
                else {
                  counter++
                  if (counter == this.topTen.length) {
                    this.requestMade = true;
                    this.result = this.resultTimeMatters;
                    this.update();
                    this.loading = false;
                    this.loaded.emit(false);
                    this.isQueried = true;
                  }
                }
              });
          }
        }
        else {
          this.oops = true
          this.errorAPI = res.message
          this.errorCode = res.code
          this.requestMade = false;
          this.requestMake.emit(this.requestMade);
          this.loading = false;
          this.loaded.emit(false);
          return " ";
        }
      });
  }

  public filterDates() {
    const merged = [];
    const mergedDate = [];
    for (let i = 0; i < this.multidocFiles.length; i++) {
      for (let j = 0; j < this.multidocFiles[i].tempOG.length; j++) {
        let dates1 = this.multidocFiles[i].tempOG[j].split("-");
        let dates2 = this.multidocFiles[i].tempOG[j].split(".");
        let dates3 = this.multidocFiles[i].tempOG[j].split("/");
        if (dates1.length == 3) {
          if (dates1[0].length == 4) {
            this.multidocFiles[i].tempExpressions[j] = new Date(dates1[0], dates1[1] - 1, dates1[2])
          }
          else {
            this.multidocFiles[i].tempExpressions[j] = new Date(dates1[2], dates1[1] - 1, dates1[0])
          }
        }
        else if (dates2.length == 3) {
          if (dates2[0].length == 4) {
            this.multidocFiles[i].tempExpressions[j] = new Date(dates2[0], dates2[1] - 1, dates2[2])
          }
          else {
            this.multidocFiles[i].tempExpressions[j] = new Date(dates2[2], dates2[1] - 1, dates2[0])
          }
        }
        else if (dates3.length == 3) {
          if (dates3[0].length == 4) {
            this.multidocFiles[i].tempExpressions[j] = new Date(dates3[0], dates3[1] - 1, dates3[2])
          }
          else {
            this.multidocFiles[i].tempExpressions[j] = new Date(dates3[2], dates3[1] - 1, dates3[0])
          }
        }
        else if (dates1.length > 1){
          this.multidocFiles[i].tempExpressions[j] = new Date(dates1[0])
        }
        else {
          this.multidocFiles[i].tempExpressions[j] = new Date(dates3[0])
        }
        mergedDate.push([this.multidocFiles[i].tempOG[j], this.multidocFiles[i].tempExpressions[j]]);
      }
      mergedDate.sort((a,b) => a[1] - b[1]);
      this.multidocFiles[i].tempExpressions = []
      this.multidocFiles[i].tempOG = []
      for (const mergedValue of mergedDate) {
        this.multidocFiles[i].tempExpressions.push(mergedValue[1]);
        this.multidocFiles[i].tempOG.push(mergedValue[0]);
      }
      merged.push([this.multidocFiles[i], this.multidocFiles[i].tempExpressions[0]]);
    }
    merged.sort((a,b) => a[1] - b[1]);
    for (const mergedValue of merged) {
      this.multidocDates.push(mergedValue[0]);
    }
    for (let i = 0; i < this.multidocDates.length; i++) {
      for (let j = 0; j < this.multidocDates[i].tempExpressions.length; j++) {
        let day = this.multidocDates[i].tempExpressions[j].getDate()
        let month = this.translateMonth(this.multidocDates[i].tempExpressions[j].getMonth())
        let year = this.multidocDates[i].tempExpressions[j].getFullYear()
        if (day == 1 && month == 'Janeiro') {
          this.multidocDates[i].tempExpressions[j] = year
        }
        else {
          this.multidocDates[i].tempExpressions[j] = day + " " + month + " " + year
        }
      }
    }
  }

  public filterScores() {
    const merged = [];
    for (let i = 0; i < this.multidocFiles.length; ++i) {
      this.multidocFiles[i].tempScores = [...new Set(this.multidocFiles[i].tempScores)]
      this.multidocFiles[i].tempScores = this.multidocFiles[i].tempScores.sort().reverse()
      merged.push([this.multidocFiles[i], this.multidocFiles[i].tempScores])
    }
    merged.sort();
    merged.reverse();
    for (const mergedValue of merged) {
      this.multidocScores.push(mergedValue[0]);
    }
  }

  public getTopTen() {
    let queryCheck = this.inp.toLowerCase().split(" ")
    queryCheck = queryCheck.filter(a => !this.avoidCheck.includes(a))

    for (let i = 0; i < this.multidocScores.length; i++) {
      let argText = this.topTen.map(a => a.text)
      let isDupe = (a) => a == this.multidocScores[i].snippet
      if (!argText.some(isDupe)) {
        if (this.multidocScores[i].snippet.toLowerCase().includes(this.inp.toLowerCase())) {
          this.topTen.push({
            text: this.multidocScores[i].snippet,
            dateOG: this.multidocScores[i].tempOG,
            date: this.multidocScores[i].tempExpressions,
            score: this.multidocScores[i].tempScores[0],
            url: this.multidocScores[i].url
          })
        }
      }
      if (this.topTen.length == 10 || this.topTen.length == this.multidocScores.length) {
        break;
      }
    }
    if (this.topTen < 10) {
      for (let i = 0; i < this.multidocScores.length; i++) {
        let argText = this.topTen.map(a => a.text)
        let isDupe = (a) => a == this.multidocScores[i].snippet
        if (!argText.some(isDupe)) {
          for (let j = 0; j < queryCheck.length; j++) {
            if (this.multidocScores[i].snippet.toLowerCase().includes(queryCheck[j])) {
              this.topTen.push({
                text: this.multidocScores[i].snippet,
                dateOG: this.multidocScores[i].tempOG,
                date: this.multidocScores[i].tempExpressions,
                score: this.multidocScores[i].tempScores[0],
                url: this.multidocScores[i].url
              })
              break;
            }
          }
          if (this.topTen.length == 10 || this.topTen.length == this.multidocScores.length) {
            break;
          }
        }
      }
    }
  }

  translateMonth(month){
    switch (month) {
      case 0:
        return "Janeiro";
      case 1:
        return "Fevereiro";
      case 2:
        return "Março";
      case 3:
        return "Abril";
      case 4:
        return "Maio";
      case 5:
        return "Junho";
      case 6:
        return "Julho";
      case 7:
        return "Agosto";
      case 8:
        return "Setembro";
      case 9:
        return "Outubro";
      case 10:
        return "Novembro";
      case 11:
        return "Dezembro";
      default:
        break;
    }
  }

  public sortStack(scores, dates, indexes) {
    if (scores.length > 0) {
      const scoreT = scores.pop();
      const dateT = dates.pop();
      const indexT = indexes.pop();
      this.sortStack(scores, dates, indexes);
      this.sortedInsert(scores, scoreT, dates, dateT, indexes, indexT);
    }
  }

  public sortedInsert(scores, scoreE, dates, dateE, indexes, indexE) {
    if (scores.length == 0 || scoreE > scores[scores.length - 1]) {
      scores.push(scoreE);
      dates.push(dateE);
      indexes.push(indexE);
    }
    else {
      const scoreX = scores.pop();
      const dateX = dates.pop();
      const indexX = indexes.pop();
      this.sortedInsert(scores, scoreE, dates, dateE, indexes, indexE);
      scores.push(scoreX);
      dates.push(dateX);
      indexes.push(indexX)
    }
  }

  resetValues() {
    this.isQueried = false;
    this.url = "";
    this.inp = "";
    this.errorCode = "";
    this.errorAPI = "";
    this.oops = false;
    this.change = false;
    this.old = "";
    this.algorithmSelected = this.algorithmOptions[0];
    this.scoringSelected = this.scoringOptions[0];
    this.dateGranularitySelected = this.dateGranularityOptions[0];
    this.documentTypeSelected = this.documentTypeOptions[0];
    this.languageSelected = this.languageOptions[0];
    this.dateBegin = 0;
    this.dateEnd = 2100;
    this.maxValTH = 1;
    this.numberOfKeyWords = 30;
    this.contextWindow = 1;
    this.contextFullSentence = true;
    this.simbaValueMax = true;
    this.simbaValue = 1;
    this.documentCreationTime = "";
    this.cheating = false;
    this.showOnlyRel = false;
    this.ngramSelected = 1;
    this.hiddenOptionKW = false;
    this.hiddenOption = false;
    this.loading = false;
    this.requestMade = false;
    this.requestMake.emit(this.requestMade);
    this.hiddenOptionTM = false;
    this.TH = 0.05;
  }

  changeTH(event: any) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    if (event.source) {
      this.TH = event.value;
      return;
    }
    else {
      if (event.target.value) {
        if (event.target.value > this.maxValTH) {
          this.TH = 1;
          return;
        }
        event.preventDefault();
        this.TH = event.target.value;
      }
      else {
        this.TH = 0;
        return;
      }
    }
    this.update();
  }

  doThings(event: any) {
  }

  update() {
    let j, k;
    if (this.contextFullSentence) {
      j = "full_sentence";
    }
    else {
      j = this.contextWindow;
    }
    if (this.simbaValueMax) {
      k = "max";
    }
    else {
      k = this.simbaValue;
    }
    if (this.requestMade) {
      this.timelineOptions = {
        docCreateTime: this.documentCreationTime,
        dateGranularity: this.dateGranularitySelected,
        score: this.scoringSelected,
        algorithm: this.algorithmSelected,
        ngram: this.ngramSelected,
        language: this.languageSelected,
        numberOfKeywords: this.numberOfKeyWords,
        nContextualWindow: j,
        documentType: this.documentTypeSelected,
        n: k,
        result: this.result,
        dateBegin: this.dateBegin,
        dateEnd: this.dateEnd,
        tH: this.TH,
      };
    }
    else {
      let a, b;
      if (this.contextFullSentence) {
        a = "full_sentence";
      }
      else {
        a = this.contextWindow;
      }
      if (this.simbaValueMax) {
        b = "max";
      }
      else {
        b = this.simbaValue;
      }
      this.timelineOptions = {
        docCreateTime: this.documentCreationTime,
        dateGranularity: this.dateGranularitySelected,
        score: this.scoringSelected,
        algorithm: this.algorithmSelected,
        ngram: this.ngramSelected,
        language: this.languageSelected,
        numberOfKeywords: this.numberOfKeyWords,
        nContextualWindow: a,
        documentType: this.documentTypeSelected,
        n: b,
        dateBegin: this.dateBegin,
        dateEnd: this.dateEnd,
        tH: this.TH,
      };
    }
  }

  formatText(text) {
    let newText = text.replace(/<kw>/g, '')
    newText = newText.replace(/<\/kw>/g, '')
    newText = newText.replace(/<d>/g, '')
    newText = newText.replace(/<\/d>/g, '')
    return newText
  }

  getBestRes() {
    let maxMention = 0
    let bestRes = ""
    for (let i = 0; i < this.wiki.annotations.length; i++) {
      let support = this.wiki.annotations[i].support
      let res = this.wiki.annotations[i].title
      for (let j = 0; j < support.length; j++) {
        let pMention = support[j].pMentionGivenSurface
        //console.log(this.wiki.annotations[i].title + " : " + pMention)
        if (pMention > maxMention) {
          maxMention = pMention
          bestRes = res
        }
      }
    }
    return bestRes
  }

  scrollDown() {
    window.scrollTo(0,700)
  }

  topScroll() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  openDialog() {
    this.dialog.open(VideoComponent, { height: "90%", width: "100%" });
  }

  changeNarrToggle() {
    let x = (<HTMLInputElement>document.getElementById('narrTextToggle'))
    if (x.innerHTML === ' Narrativa') {
      x.innerHTML = ' Texto Livre'
      console.log('Texto Livre')
      this.router.navigate(['']).then(r => '')
    }
    else {
      x.innerHTML = ' Narrativa'
      console.log('Query / URL')
      this.router.navigate(['texto-livre']).then(r => '')
    }
  }

  changeNarrToHome() {
    let x = (<HTMLInputElement>document.getElementById('narrTextToggle'))
    if (x.innerHTML === ' Narrativa') {
      this.router.navigate(['']).then(r => '')
      location.reload();
    }
    else {
      this.router.navigate(['texto-livre']).then(r => '')
      location.reload();
    }
  }

  switchLanguage() {
    let pt = (<HTMLInputElement>document.getElementById('ptFlag'))
    let eng = (<HTMLInputElement>document.getElementById('engFlag'))
    if (pt.style.display === "block") {
      eng.style.display = "block"
      pt.style.display = "none"
    }
    else {
      eng.style.display = "none"
      pt.style.display = "block"
    }
  }

  @HostListener("document:scroll")
  scrollFunction() {
    let toTopArrow = (<HTMLInputElement>document.getElementById('toTopArrow'))
    let bannerLogo = (<HTMLInputElement>document.getElementById('bannerLogo'))
    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
      toTopArrow.style.display = "block"
      bannerLogo.style.display = "block"
    }
    else {
      toTopArrow.style.display = "none"
      bannerLogo.style.display = "none"
    }
  }
}
