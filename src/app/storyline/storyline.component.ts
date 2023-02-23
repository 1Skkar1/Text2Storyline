import { Component, OnInit, Input } from "@angular/core";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { YakeService } from "../services/yake.service";
import { ArquivoService } from "../services/arquivo.service";
import { catchError, take } from "rxjs/operators";
import { throwError } from "rxjs";

declare var TL: any;
declare var $: any;

interface Evento {
  text?: string;
  start_date?: Date;
  media: any;
}

@Component({
  selector: 'app-storyline',
  templateUrl: './storyline.component.html',
  styleUrls: ['./storyline.component.css']
})

export class StorylineComponent implements OnInit {
  @Input() queryType: string;
  @Input() multidocFiles: any;
  @Input() compGeral: any;
  @Input() docSen: any;
  @Input() allArgs: any;
  @Input() relArgs: any;
  @Input() query: string;
  @Input() topTen: any;
  @Input() indexDate: Array<any>;
  @Input() lang: any;
  @Input() id: any;

  public relevant: boolean;
  public args: any;
  public events: Array<any>;
  public timeline: any;
  public isSet: boolean;
  public notSet: boolean;
  public jsonText: string;
  public loading: boolean;
  public noData: boolean;
  public scheduler: any;
  public images: Array<any>;
  public multiRelArgs: Array<any>;
  public init: boolean;

  constructor(
    private _snackBar: MatSnackBar,
    private yake: YakeService,
    private arquivo: ArquivoService
  ) {
    this.isSet = false;
    this.notSet = true;
    this.loading = false;
    this.relevant = false;
    this.noData = false;
    this.events = [];
    this.images = [];
    this.args = [];
    this.multiRelArgs = [];
    this.init = false;
  }

  ngOnInit() {
    // setTimeout(()=>{this.update();}, 5);
  }

  ngAfterViewChecked() {
    if (this.queryType == "single" || this.queryType == "freetext") {
      if (this.id == 'normal') {
        if (document.getElementById("my-timeline") && this.notSet) {
          this.notSet = false;
          if (this.relArgs.length == 0) {
            this.relevant = false;
          }
          this.setRelevanceSingle();
          this.isSet = true;
        }
      }
      else {
        if (document.getElementById("single-timeline") && this.notSet) {
          this.notSet = false;
          if (this.relArgs.length == 0) {
            this.relevant = false;
          }
          this.setRelevanceSingle();
          this.isSet = true;
        }
      }
    }
    else {
      if (document.getElementById("my-timeline") && this.notSet) {
        this.notSet = false;
        if (this.args.length == 0) {
          this.relevant = false;
        }
        this.setRelevanceMulti();
        this.isSet = true;
      }
    }
  }

  setRelevanceSingle() {
    this.relevant = !this.relevant;
    this.events = [];
    this.images = [];
    if (this.relevant) {
      this.args = this.relArgs;
    }
    else {
      this.args = this.allArgs;
    }
    this.loading = true;
    this.updateSingle();
  }

  setRelevanceMulti() {
    this.relevant = !this.relevant;
    this.loading = true;
    this.events = [];
    this.images = [];

    if (!this.init) {
      for (let i = 0; i < this.topTen.length; i++) {
        if (this.topTen[i].score >= 0.35) {
          this.multiRelArgs.push(this.topTen[i])
        }
      }
      this.init = true
    }

    if (this.relevant) {
      this.args = this.multiRelArgs;
    }
    else {
      this.args = this.topTen;
    }

    this.updateMulti();
  }

  updateSingle() {
    let j: any;
    let counter = 0;
    if (this.args.length == 0) {
      this.loading = false;
      this.noData = true;
      this._snackBar.open("No data", this.args.length, {
        duration: 2000,
      });
    }
    else {
      this.noData = false;
    }

    // tslint:disable-next-line: forin
    for (let h = 0; h < this.args.length; h++) {
      if (this.args[h].y.includes("<strong")) {
        this.yake
          .getKeywords(this.args[h].y
              .split("<p>")
              .join("")
              .split("</p>")[1]
              .split("(...)")
              .join("")
              .split("<kw>")
              .join("")
              .split("</kw>")
              .join("")
              .split("<d>")
              .join("")
              .split("</d>")
              .join("")
              .split("</strong>")
              .join("")
              .split("<strong>")
              .join(""),
            3,
            1)
          .pipe(
            catchError(err => {
              console.log('Yake Error: ', err);
              return throwError(err);
            }),
            take(1))
          .subscribe((res) => {
            console.log(res)
            if (res.keywords) {
              let captio = res.keywords[0].ngram;
              let exists = false
              let index_for_this_request = 0;
              this.images.map((cada) => {
                if (cada.key == captio) {
                  cada.current_index = cada.current_index + 1
                  if (index_for_this_request <= cada.current_index) {
                    index_for_this_request = cada.current_index + 1
                  }
                  exists = true
                }
              })
              if (!exists) {
                this.images.push({key: captio, current_index:0})
              }
              else {
                this.images.push({key: captio, current_index:index_for_this_request})
              }

              this.arquivo
                .getImgURL(captio)
                .pipe(
                  catchError(err => {
                    console.log('Arquivo Image Error: ', err);
                    return throwError(err);
                  }),
                  take(1))
                .subscribe((res2) => {
                  if (res2) {
                    console.log(res2)
                    counter++
                    let url2 = res2.responseItems[index_for_this_request].imgLinkToArchive
                    if (this.args[h].x.length == 4) {
                      this.events.push({
                        start_date: {
                          year: this.args[h].x,
                          display_date: "<p class='dateTL'>" + this.args[h].x + "</p>",
                        },
                        media: {
                          thumbnail: url2,
                          url: url2,
                          link: url2,
                          credit:
                            '<p class="textoArquivo">powered by Arquivo.pt</p>',
                        },
                        text: {
                          headline:
                            '<p class="changeCaptio">' +
                            captio.substring(0, 1).toUpperCase() +
                            captio.substring(1, captio.length) +
                            "</p>",
                          text: this.args[h].y,
                        },
                      });
                    }
                    else if (this.args[h].x.split("-").length === 2) {
                      let month = this.args[h].x.split("-")[1];
                      let month_string = this.translateMonth(month);
                      // tslint:disable-next-line: max-line-length
                      this.events.push({
                        start_date: {
                          year: this.args[h].x.split("-")[0],
                          month: this.args[h].x.split("-")[1],
                          display_date: "<p class='dateTL'>" + month_string + " de " + this.args[h].x.split("-")[0] + "</p>",
                        },
                        media: {
                          thumbnail: url2,
                          url: url2,
                          link: url2,
                          credit:
                            '<p class="textoArquivo">powered by Arquivo.pt</p>',
                        },
                        text: {
                          headline:
                            "<p>" +
                            captio.substring(0, 1).toUpperCase() +
                            captio.substring(1, captio.length) +
                            "</p>",
                          text: this.args[h].y,
                        },
                      });
                    }
                    else {
                      if (this.args[h].x.length > 10) {
                        if (this.args[h].x.charAt(10) == "\\" ||
                          this.args[h].x.charAt(12) * 1 >= 0 &&
                          this.args[h].x.charAt(12) * 1 <= 9) {
                          let horas = this.args[h].x
                            .substring(10)
                            .split(":")[0];

                          let min = this.args[h].x
                            .substring(10)
                            .split(":")[1];

                          if (min * 1 > 0 && min * 1 < 60) {
                            let month = this.args[h].x.split("-")[1];
                            let month_string = this.translateMonth(month)

                            // tslint:disable-next-line: max-line-length
                            this.events.push({
                              start_date: {
                                year: this.args[h].x
                                  .substring(0, 10)
                                  .split("-")[0],
                                month: this.args[h].x
                                  .substring(0, 10)
                                  .split("-")[1],
                                day: this.args[h].x
                                  .substring(0, 10)
                                  .split("-")[2],
                                display_date:
                                  "<p class='dateTL'>" + this.args[h].x
                                    .substring(0, 10)
                                    .split("-")[2] +
                                  " de " +
                                  month_string +
                                  " de " +
                                  this.args[h].x
                                    .substring(0, 10)
                                    .split("-")[0] +
                                  " às " +
                                  horas.substring(1) +
                                  ":" +
                                  min + "</p>",
                              },
                              media: {
                                thumbnail: url2,
                                url: url2,
                                link: url2,
                                credit:
                                  '<p class="textoArquivo">powered by Arquivo.pt</p>',
                              },
                              text: {
                                text: this.args[h].y,
                              },
                            });
                          }
                          else {
                            let month = this.args[h].x.split("-")[1];
                            let month_string = this.translateMonth(month);
                            this.events.push({
                              start_date: {
                                year: this.args[h].x
                                  .substring(0, 10)
                                  .split("-")[0],
                                month: this.args[h].x
                                  .substring(0, 10)
                                  .split("-")[1],
                                day: this.args[h].x
                                  .substring(0, 10)
                                  .split("-")[2],
                                display_date:
                                  "<p class='dateTL'>" + this.args[h].x
                                    .substring(0, 10)
                                    .split("-")[2] +
                                  " de " +
                                  month_string +
                                  " de " +
                                  this.args[h].x
                                    .substring(0, 10)
                                    .split("-")[0] +
                                  " às " +
                                  horas.substring(1) + ":00" + "</p>",
                              },
                              media: {
                                thumbnail: url2,
                                url: url2,
                                link: url2,
                                credit:
                                  '<p class="textoArquivo">powered by Arquivo.pt</p>',
                              },
                              text: {
                                headline:
                                  "<p>" +
                                  captio.substring(0, 1).toUpperCase() +
                                  captio.substring(1, captio.length) +
                                  "</p>",
                                text: this.args[h].y,
                              },
                            });
                          }
                        }
                        else {
                          let month = this.args[h].x.split("-")[1];
                          let month_string = this.translateMonth(month)

                          // tslint:disable-next-line: max-line-length
                          this.events.push({
                            start_date: {
                              year: this.args[h].x
                                .substring(0, 10)
                                .split("-")[0],
                              month: this.args[h].x
                                .substring(0, 10)
                                .split("-")[1],
                              day: this.args[h].x
                                .substring(0, 10)
                                .split("-")[2],
                              display_date:
                                "<p class='dateTL'>" + this.args[h].x
                                  .substring(0, 10)
                                  .split("-")[2] +
                                " de " +
                                month_string +
                                " de " +
                                this.args[h].x
                                  .substring(0, 10)
                                  .split("-")[0] + "</p>",
                            },
                            media: {
                              thumbnail: url2,
                              url: url2,
                              link: url2,
                              credit:
                                '<p class="textoArquivo">powered by Arquivo.pt</p>',
                            },
                            text: {
                              headline:
                                "<p>" +
                                captio.substring(0, 1).toUpperCase() +
                                captio.substring(1, captio.length) +
                                "</p>",
                              text: this.args[h].y,
                            },
                          });
                        }
                      }
                      else {
                        let month = this.args[h].x.split("-")[1];
                        let month_string = this.translateMonth(month);

                        // tslint:disable-next-line: max-line-length
                        this.events.push({
                          start_date: {
                            year: this.args[h].x
                              .substring(0, 10)
                              .split("-")[0],
                            month: this.args[h].x
                              .substring(0, 10)
                              .split("-")[1],
                            day: this.args[h].x
                              .substring(0, 10)
                              .split("-")[2],
                            display_date:
                              "<p class='dateTL'>" + this.args[h].x
                                .substring(0, 10)
                                .split("-")[2] +
                              " de " +
                              month_string +
                              " de " +
                              this.args[h].x
                                .substring(0, 10)
                                .split("-")[0] + "</p>",
                          },
                          media: {
                            thumbnail: url2,
                            url: url2,
                            link: url2,
                            credit:
                              '<p class="textoArquivo">powered by Arquivo.pt</p>',
                          },
                          text: {
                            headline:
                              "<p>" +
                              captio.substring(0, 1).toUpperCase() +
                              captio.substring(1, captio.length) +
                              "</p>",
                            text: this.args[h].y,
                          },
                        });
                      }
                    }
                  }
                  if (counter == this.args.length) {
                    this.loading = false;
                    j = { events: this.events };
                    this.jsonText = j;
                    const additionalOptions = {
                      start_at_end: false,
                      timenav_height: 10,
                      default_bg_color: { r: 255, g: 255, b: 255 },
                      trackResize: "false",
                    };

                    if (this.id == 'normal') {
                      // tslint:disable-next-line: no-unused-expression
                      new TL.Timeline("my-timeline", j, additionalOptions);
                      return;
                    }
                    else {
                      // tslint:disable-next-line: no-unused-expression
                      new TL.Timeline("single-timeline", j, additionalOptions);
                      return;
                    }
                  }
                });
            }
            else {
              counter++
              if (counter == this.args.length) {
                this.loading = false;
                j = { events: this.events };
                this.jsonText = j;
                const additionalOptions = {
                  start_at_end: false,
                  timenav_height: 10,
                  default_bg_color: { r: 255, g: 255, b: 255 },
                  trackResize: "false",
                };

                if (this.id == 'normal') {
                  // tslint:disable-next-line: no-unused-expression
                  new TL.Timeline("my-timeline", j, additionalOptions);
                  return;
                }
                else {
                  // tslint:disable-next-line: no-unused-expression
                  new TL.Timeline("single-timeline", j, additionalOptions);
                  return;
                }
              }
            }
          });
      }
    }
  }

  updateMulti() {
    let j: any;
    let counter = 0;
    if (this.args.length == 0) {
      this.loading = false;
      this.noData = true;
      this._snackBar.open("No data", this.args.length, {
        duration: 2000,
      });
    }
    else {
      this.noData = false;
    }

    // tslint:disable-next-line: forin
    for (let h = 0; h < this.args.length; h++) {
      this.yake
        .getKeywords(this.args[h].text, 3,1)
        .pipe(
          catchError(err => {
            console.log('Yake Error: ', err);
            return throwError(err);
          }),
          take(1))
        .subscribe((res) => {
          //console.log(res)
          if (res.keywords) {
            let captio = res.keywords[0].ngram;
            let exists = false
            let index_for_this_request = 0;
            this.images.map( (cada) => {
              if (cada.key == captio) {
                cada.current_index = cada.current_index +1
                if (index_for_this_request <= cada.current_index){
                  index_for_this_request = cada.current_index +1
                }
                exists = true
              }
            })
            if (!exists) {
              this.images.push({key: captio, current_index:0})
            }
            else {
              this.images.push({key: captio, current_index:index_for_this_request})
            }

            this.arquivo
              .getImgURL(captio)
              .pipe(
                catchError(err => {
                  console.log('Arquivo Image Error: ', err);
                  return throwError(err);
                }),
                take(1))
              .subscribe((res2) => {
                if (res2) {
                  //console.log(res2)
                  counter++
                  let url2 = res2.responseItems[index_for_this_request].imgLinkToArchive;
                  if (this.args[h].date[this.indexDate[h]].toString().length == 4) {

                    if (this.args[h].score >= 0.9) {
                      this.events.push({
                        start_date: {
                          year: this.args[h].date[this.indexDate[h]],
                          display_date: "<p class='dateTL'>" + this.args[h].date[this.indexDate[h]] + "</p>",
                        },
                        media: {
                          thumbnail: url2,
                          url: url2,
                          link: url2,
                          credit:
                            '<p class="textoArquivo">powered by Arquivo.pt</p>',
                        },
                        text: {
                          headline:
                            '<p class="changeCaptio">' +
                            captio.substring(0, 1).toUpperCase() +
                            captio.substring(1, captio.length) +
                            "</p>",
                          text: "<p class='scoreTL noticem8'>Score: " + this.args[h].score + "</p><p class='textTL'>" + this.args[h].text + "</p>"
                        }
                      });
                    }

                    else if (this.args[h].score >= 0.7) {
                      this.events.push({
                        start_date: {
                          year: this.args[h].date[this.indexDate[h]],
                          display_date: "<p class='dateTL'>" + this.args[h].date[this.indexDate[h]] + "</p>",
                        },
                        media: {
                          thumbnail: url2,
                          url: url2,
                          link: url2,
                          credit:
                            '<p class="textoArquivo">powered by Arquivo.pt</p>',
                        },
                        text: {
                          headline:
                            '<p class="changeCaptio">' +
                            captio.substring(0, 1).toUpperCase() +
                            captio.substring(1, captio.length) +
                            "</p>",
                          text: "<p class='scoreTL noticem4'>Score: " + this.args[h].score + "</p><p class='textTL'>" + this.args[h].text + "</p>"
                        }
                      });
                    }

                    else if (this.args[h].score >= 0.5) {
                      this.events.push({
                        start_date: {
                          year: this.args[h].date[this.indexDate[h]],
                          display_date: "<p class='dateTL'>" + this.args[h].date[this.indexDate[h]] + "</p>",
                        },
                        media: {
                          thumbnail: url2,
                          url: url2,
                          link: url2,
                          credit:
                            '<p class="textoArquivo">powered by Arquivo.pt</p>',
                        },
                        text: {
                          headline:
                            '<p class="changeCaptio">' +
                            captio.substring(0, 1).toUpperCase() +
                            captio.substring(1, captio.length) +
                            "</p>",
                          text: "<p class='scoreTL noticem6'>Score: " + this.args[h].score + "</p><p class='textTL'>" + this.args[h].text + "</p>"
                        }
                      });
                    }

                    else if (this.args[h].score >= 0.35) {
                      this.events.push({
                        start_date: {
                          year: this.args[h].date[this.indexDate[h]],
                          display_date: "<p class='dateTL'>" + this.args[h].date[this.indexDate[h]] + "</p>",
                        },
                        media: {
                          thumbnail: url2,
                          url: url2,
                          link: url2,
                          credit:
                            '<p class="textoArquivo">powered by Arquivo.pt</p>',
                        },
                        text: {
                          headline:
                            '<p class="changeCaptio">' +
                            captio.substring(0, 1).toUpperCase() +
                            captio.substring(1, captio.length) +
                            "</p>",
                          text: "<p class='scoreTL noticem5'>Score: " + this.args[h].score + "</p><p class='textTL'>" + this.args[h].text + "</p>"
                        }
                      });
                    }

                    else {
                      this.events.push({
                        start_date: {
                          year: this.args[h].date[this.indexDate[h]],
                          display_date: "<p class='dateTL'>" + this.args[h].date[this.indexDate[h]] + "</p>",
                        },
                        media: {
                          thumbnail: url2,
                          url: url2,
                          link: url2,
                          credit:
                            '<p class="textoArquivo">powered by Arquivo.pt</p>',
                        },
                        text: {
                          headline:
                            '<p class="changeCaptio">' +
                            captio.substring(0, 1).toUpperCase() +
                            captio.substring(1, captio.length) +
                            "</p>",
                          text: "<p class='scoreTL noticem7'>Score: " + this.args[h].score + "</p><p class='textTL'>" + this.args[h].text + "</p>"
                        }
                      });
                    }
                  }

                  else {
                    if (this.args[h].score >= 0.9) {
                      this.events.push({
                        start_date: {
                          year: this.args[h].date[this.indexDate[h]].split(' ')[2],
                          month: this.reverseMonth(this.args[h].date[this.indexDate[h]].split(' ')[1]),
                          day: this.args[h].date[this.indexDate[h]].split(' ')[0],
                          display_date: "<p class='dateTL'>" + this.args[h].date[this.indexDate[h]] + "</p>",
                        },
                        media: {
                          thumbnail: url2,
                          url: url2,
                          link: url2,
                          credit:
                            '<p class="textoArquivo">powered by Arquivo.pt</p>',
                        },
                        text: {
                          headline:
                            '<p class="changeCaptio">' +
                            captio.substring(0, 1).toUpperCase() +
                            captio.substring(1, captio.length) +
                            "</p>",
                          text: "<p class='scoreTL noticem8'>Score: " + this.args[h].score + "</p><p class='textTL'>" + this.args[h].text + "</p>"
                        }
                      });
                    }

                    else if (this.args[h].score >= 0.7) {
                      this.events.push({
                        start_date: {
                          year: this.args[h].date[this.indexDate[h]].split(' ')[2],
                          month: this.reverseMonth(this.args[h].date[this.indexDate[h]].split(' ')[1]),
                          day: this.args[h].date[this.indexDate[h]].split(' ')[0],
                          display_date: "<p class='dateTL'>" + this.args[h].date[this.indexDate[h]] + "</p>",
                        },
                        media: {
                          thumbnail: url2,
                          url: url2,
                          link: url2,
                          credit:
                            '<p class="textoArquivo">powered by Arquivo.pt</p>',
                        },
                        text: {
                          headline:
                            '<p class="changeCaptio">' +
                            captio.substring(0, 1).toUpperCase() +
                            captio.substring(1, captio.length) +
                            "</p>",
                          text: "<p class='scoreTL noticem4'>Score: " + this.args[h].score + "</p><p class='textTL'>" + this.args[h].text + "</p>"
                        }
                      });
                    }

                    else if (this.args[h].score >= 0.5) {
                      this.events.push({
                        start_date: {
                          year: this.args[h].date[this.indexDate[h]].split(' ')[2],
                          month: this.reverseMonth(this.args[h].date[this.indexDate[h]].split(' ')[1]),
                          day: this.args[h].date[this.indexDate[h]].split(' ')[0],
                          display_date: "<p class='dateTL'>" + this.args[h].date[this.indexDate[h]] + "</p>",
                        },
                        media: {
                          thumbnail: url2,
                          url: url2,
                          link: url2,
                          credit:
                            '<p class="textoArquivo">powered by Arquivo.pt</p>',
                        },
                        text: {
                          headline:
                            '<p class="changeCaptio">' +
                            captio.substring(0, 1).toUpperCase() +
                            captio.substring(1, captio.length) +
                            "</p>",
                          text: "<p class='scoreTL noticem6'>Score: " + this.args[h].score + "</p><p class='textTL'>" + this.args[h].text + "</p>"
                        }
                      });
                    }

                    else if (this.args[h].score >= 0.35) {
                      this.events.push({
                        start_date: {
                          year: this.args[h].date[this.indexDate[h]].split(' ')[2],
                          month: this.reverseMonth(this.args[h].date[this.indexDate[h]].split(' ')[1]),
                          day: this.args[h].date[this.indexDate[h]].split(' ')[0],
                          display_date: "<p class='dateTL'>" + this.args[h].date[this.indexDate[h]] + "</p>",
                        },
                        media: {
                          thumbnail: url2,
                          url: url2,
                          link: url2,
                          credit:
                            '<p class="textoArquivo">powered by Arquivo.pt</p>',
                        },
                        text: {
                          headline:
                            '<p class="changeCaptio">' +
                            captio.substring(0, 1).toUpperCase() +
                            captio.substring(1, captio.length) +
                            "</p>",
                          text: "<p class='scoreTL noticem5'>Score: " + this.args[h].score + "</p><p class='textTL'>" + this.args[h].text + "</p>"
                        }
                      });
                    }

                    else {
                      this.events.push({
                        start_date: {
                          year: this.args[h].date[this.indexDate[h]].split(' ')[2],
                          month: this.reverseMonth(this.args[h].date[this.indexDate[h]].split(' ')[1]),
                          day: this.args[h].date[this.indexDate[h]].split(' ')[0],
                          display_date: "<p class='dateTL'>" + this.args[h].date[this.indexDate[h]] + "</p>",
                        },
                        media: {
                          thumbnail: url2,
                          url: url2,
                          link: url2,
                          credit:
                            '<p class="textoArquivo">powered by Arquivo.pt</p>',
                        },
                        text: {
                          headline:
                            '<p class="changeCaptio">' +
                            captio.substring(0, 1).toUpperCase() +
                            captio.substring(1, captio.length) +
                            "</p>",
                          text: "<p class='scoreTL noticem7'>Score: " + this.args[h].score + "</p><p class='textTL'>" + this.args[h].text + "</p>"
                        }
                      });
                    }
                  }

                  if (counter == this.args.length) {
                    this.loading = false;
                    j = { events: this.events };
                    this.jsonText = j;
                    const additionalOptions = {
                      start_at_end: false,
                      timenav_height: 10,
                      default_bg_color: { r: 255, g: 255, b: 255 },
                      trackResize: "false",
                    };

                    if (this.id == 'normal') {
                      // tslint:disable-next-line: no-unused-expression
                      new TL.Timeline("my-timeline", j, additionalOptions);
                      return;
                    }
                    else {
                      // tslint:disable-next-line: no-unused-expression
                      new TL.Timeline("single-timeline", j, additionalOptions);
                      return;
                    }
                  }
                }
              });
          }
          else {
            counter++
            if (counter == this.args.length) {
              this.loading = false;
              j = { events: this.events };
              this.jsonText = j;
              const additionalOptions = {
                start_at_end: false,
                timenav_height: 10,
                default_bg_color: { r: 255, g: 255, b: 255 },
                trackResize: "false",
              };

              if (this.id == 'normal') {
                // tslint:disable-next-line: no-unused-expression
                new TL.Timeline("my-timeline", j, additionalOptions);
                return;
              }
              else {
                // tslint:disable-next-line: no-unused-expression
                new TL.Timeline("single-timeline", j, additionalOptions);
                return;
              }
            }
          }
        });
    }
  }

  public copyToClipboard(event: any) {
    event.preventDefault();
    this._snackBar.open(
      "JSON copied to Clipboard",
      "Length: " + JSON.stringify(this.jsonText).length + " characters",
      {
        duration: 2000,
      }
    );
    const clipboard = document.createElement("input");
    clipboard.setAttribute("value", JSON.stringify(this.jsonText));
    document.body.appendChild(clipboard);
    clipboard.select();
    document.execCommand("copy");
    document.body.removeChild(clipboard);
  }

  translateMonth(month:string){
    switch (month) {
      case "01":
        return "Janeiro";
      case "02":
        return "Fevereiro";
      case "03":
        return "Março";
      case "04":
        return "Abril";
      case "05":
        return "Maio";
      case "06":
        return "Junho";
      case "07":
        return "Julho";
      case "08":
        return "Agosto";
      case "09":
        return "Setembro";
      case "10":
        return "Outubro";
      case "11":
        return "Novembro";
      case "12":
        return "Dezembro";
      default:
        break;
    }
  }

  reverseMonth(month){
    switch (month) {
      case "Janeiro":
        return 1;
      case "Fevereiro":
        return 2;
      case "Março":
        return 3;
      case "Abril":
        return 4;
      case "Maio":
        return 5;
      case "Junho":
        return 6;
      case "Julho":
        return 7;
      case "Agosto":
        return 8;
      case "Setembro":
        return 9;
      case "Outubro":
        return 10;
      case "Novembro":
        return 11;
      case "Dezembro":
        return 12;
      default:
        break;
    }
  }
}
