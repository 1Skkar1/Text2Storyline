import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { TimelineService } from "../services/timeline.service";
import { GoogleTrendsService } from "../services/googletrends.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';
import {catchError, take, timeout} from "rxjs/operators";
import {VideoComponent} from "../video/video.component";
import {PageEvent} from "@angular/material/paginator";
import {WikifierService} from "../services/wikifier.service";

@Component({
  selector: "app-query",
  templateUrl: "./query.component.html",
  styleUrls: ["./query.component.css"],
})

export class QueryComponent implements OnChanges {
  @Input() errorWikifier: boolean;
  @Input() options: any;
  @Input() article: any;
  @Input() inpSingle: string;
  @Input() inpMultiple: string;
  @Input() summary: Array<string>;
  @Input() queryType: string;
  @Input() multidocFiles: Array<any>;
  @Input() multidocDates: Array<any>;
  @Input() multidocScores: Array<any>;
  @Input() topTen: any;
  @Input() wiki: any;
  @Input() dbpedia: any;

  @Output() toBack: EventEmitter<any> = new EventEmitter();

  public related: Array<any>;
  public loadingRelated: boolean;
  public showOnlyRelAT: boolean;
  public showOnlyRelTC: boolean;
  public withKeywords: boolean;
  public withKeywordsSentence: string;
  public withEntities: boolean;
  public withEntitiesSentence: string;
  public sortBy: string;
  public dataset: Array<any>;
  public datasetFixed: Array<any>;
  public datasetFixed2: Array<any>;
  public df: [{
    date: string;
    text: string;
    score: string;
  }];
  public df2: [{
    date: string;
    text: string;
    score: string;
  }];
  public multidf: [{
    fakeDate: any;
    date: string;
    text: string;
    score: string;
  }];
  public multidf2: [{
    fakeDate: any;
    date: string;
    text: string;
    score: string;
  }];
  public datasetRelOnly: Array<any>;
  public differentValues: Array<any>;
  public differentRelValues: Array<any>;
  public score: string;
  public page: number;
  public exe_time_total: string;
  public exe_time_YAKE: string;
  public exe_time_algo: string;
  public exe_time_GTE: string;
  public numTotal: number;
  public numTotal2: number;
  public multiLen: number;
  public multidocDecoy: any;
  public multidocSpliced: any;
  public singleNarr: boolean;
  public loadingSingleNarr: boolean;
  public errorSingleNarr: boolean;
  public errorWikifierSingleNarr: boolean;
  public wikiSingleNarr: any;
  public dbpediaSingleNarr: any;
  public finishSingleNarr: boolean;
  public urlSingleNarr: string;
  public singleNarrOptions: any;
  public resultSingleNarr: any;

  public exe_time_total_SingleNarr: string;
  public exe_time_YAKE_SingleNarr: string;
  public exe_time_GTE_SingleNarr: string;

  // tslint:disable-next-line: variable-name
  constructor(
    private timeline: TimelineService,
    private googletrends: GoogleTrendsService,
    private wikifier: WikifierService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loadingRelated = true;
    this.withKeywords = false;
    this.withKeywordsSentence = "Keywords Off";
    this.withEntities = true;
    this.withEntitiesSentence = "Entities Off";
    this.sortBy = "scores"
    this.showOnlyRelAT = true;
    this.showOnlyRelTC = true;
    this.differentValues = [];
    this.page = 0;
    this.score = "doc";
    this.queryType = "";
    // @ts-ignore
    this.df = [];
    // @ts-ignore
    this.df2 = [];
    // @ts-ignore
    this.multidf = [];
    // @ts-ignore
    this.multidf2 = [];
    this.loadingSingleNarr = false;
    this.errorSingleNarr = false;
    this.errorWikifierSingleNarr = false;
    this.finishSingleNarr = false;
    this.singleNarrOptions = {
      docCreateTime: "",
      dateGranularity: "full",
      score: "doc",
      algorithm: "py_heideltime",
      ngram: 1,
      language: "Portuguese",
      numberOfKeywords: 30,
      nContextualWindow: true,
      documentType: "news",
      n: "max",
      result: "",
      dateBegin: 0,
      dateEnd: 2100,
      tH: 0.05,
    };
  }

  ngOnInit() {
    if (this.queryType == "single") {

    }
    else {
      this.googletrends
        .getRelated(this.inpMultiple, 20)
        .pipe(take(1))
        .subscribe((res) => {
          console.log(res)
          if (res.result) {
            this.related = res.result
            this.loadingRelated = false
          }
          else {
            this.related = []
            this.loadingRelated = false
          }
        });
    }
  }

  ngOnChanges() {
    if (this.queryType == "single") {
      this.updateSingle();
    }
    else {
      this.updateMultiple();
    }
  }

  public copyToClipboard(event: any) {
    let copyText = this.options.result.TextNormalized

    copyText = copyText.replace(new RegExp("<kw>",'gi'), '')
    copyText = copyText.replace(new RegExp("</kw>",'gi'), '')
    copyText = copyText.replace(new RegExp("<d>",'gi'), '')
    copyText = copyText.replace(new RegExp("</d>",'gi'), '')

    for (let i = 0; i < this.options.result.TempExpressions.length; i++) {
      copyText = copyText.replace(new RegExp(this.options.result.TempExpressions[i][0],'gi'), this.options.result.TempExpressions[i][1])
    }

    event.preventDefault();
    this._snackBar.open(
      "Mensagem copiada para o clipboard",
      "Tamanho: " + copyText.length + " carateres",
      {duration: 2000}
    );
    const clipboard = document.createElement("input");
    clipboard.setAttribute("value", copyText);
    document.body.appendChild(clipboard);
    clipboard.select();
    document.execCommand("copy");
    document.body.removeChild(clipboard);
  }

  public updateSingle() {
    this.exe_time_total = this.options.result.ExecutionTime.TotalTime.toFixed(3);
    this.exe_time_YAKE = this.options.result.ExecutionTime.YAKE.toFixed(3);
    this.exe_time_GTE = this.options.result.ExecutionTime.GTE.toFixed(3);

    if (this.options.result.ExecutionTime.heideltime_processing) {
      this.exe_time_algo = this.options.result.ExecutionTime.heideltime_processing.toFixed(
        3
      );
    }
    else {
      this.exe_time_algo = this.options.result.ExecutionTime.rule_based_processing.toFixed(
        3
      );
    }

    this.score = this.options.score;
    let last = "";
    this.numTotal = this.options.result.TempExpressions.length;
    this.numTotal2 = this.options.result.TempExpressions.filter((cada) => {
      return cada[1] > 0.35;
    }).length;

    this.numTotal = this.options.result.TempExpressions.length;
    this.numTotal2 = this.options.result.TempExpressions.filter((cada) => {
      return this.options.result.Score[cada[0].toLowerCase()][0] > 0.35;
    }).length;
    last = "";
    this.differentValues = this.options.result.TempExpressions.sort(
      (a, b) => a[0] - b[0]
    ).filter((element, index, array) => {
      if (index == 0) {
        last = Object.assign({}, element[0]);
        return /^\d+$/.test(element[0].toString().split("-").join(""));
      }
      else {
        let este = Object.assign({}, last);
        last = Object.assign({}, element[0]);
        return (
          element[0].toString().split("-").join("") != este &&
          /^\d+$/.test(element[0].toString().split("-").join(""))
        );
      }
    });

    if (this.options.score == "doc") {
      this.differentRelValues = this.differentValues.filter(
        (element, index, array) => {
          // tslint:disable-next-line: no-shadowed-variable
          last = element[0];
          const a = element[0].toLowerCase() + "";
          return this.options.result.Score[a][0] > 0.35;
        }
      );
    }
    else {
      // tslint:disable-next-line: no-shadowed-variable
      this.differentRelValues = this.differentValues.map((a) => {
        return this.options.result.Score[a[0]];
      });

      let valores = Object.keys(this.options.result.Score);
      let total2 = 0;

      valores.map((kelp) => {
        Object.keys(this.options.result.SentencesTokens).map((kolp) => {
          if (this.options.result.Score[kelp][kolp + ""]) {
            if (this.options.result.Score[kelp][kolp + ""][0] > 0.35) {
              total2++;
            }
          }
        });
      });

      this.numTotal2 = total2;
      valores = Object.keys(this.options.result.Score);

      total2 = 0;
      valores.map((kelp) => {
        Object.keys(this.options.result.SentencesTokens).map((kolp) => {
          if (this.options.result.Score[kelp][kolp + ""]) {
            if (this.options.result.Score[kelp][kolp + ""][0] >= 0) {
              total2++;
            }
          }
        });
      });
      this.numTotal = total2;
    }
    let c = [];
    let a = {};
    let b = {};
    const d = [];

    let c2 = [];
    let a2: {} = {};
    const b2 = {};
    const d2 = [];

    // tslint:disable-next-line: forin
    for (const i in Object.keys(this.options.result.Score)) {
      if (this.options.score == "doc") {
        let value_to_be_replaced = Object.keys(this.options.result.Score)[i];
        let value_to_replace_for = this.options.result.TempExpressions.filter(
          (a) => {
            return (
              a[0].toLowerCase() == Object.keys(this.options.result.Score)[i]
            );
          }
        )[0][1];
        value_to_replace_for =
          "<strong><d>" + value_to_replace_for + "</d></strong>";

        let sentence_to_write = this.options.result.SentencesNormalized.map(
          (a) => {
            if (
              a
                .toLowerCase()
                .toString()
                .search(
                  Object.keys(this.options.result.Score)[i].toLowerCase()
                ) != -1
            ) {
              let nova = a.replace(
                "<d>" + value_to_be_replaced + "</d>",
                "<d>" + value_to_replace_for + "</d>"
              );

              nova = nova.replace(
                "<d>" + value_to_be_replaced.toUpperCase() + "</d>",
                "<d>" + value_to_replace_for + "</d>"
              );
              return nova;
            }
          }
        );

        sentence_to_write = sentence_to_write.join("__,");
        this.options.result.TempExpressions.map((a) => {
          if (sentence_to_write.search(a[0]) != -1) {
            sentence_to_write = sentence_to_write.replace(
              "<d>" + a[0] + "</d>",
              "<d>" + a[1] + "</d>"
            );
          }
          if (sentence_to_write.search(a[0].toUpperCase()) != -1) {
            sentence_to_write = sentence_to_write.replace(
              "<d>" + a[0].toUpperCase() + "</d>",
              "<d>" + a[1] + "</d>"
            );
          }
        });

        sentence_to_write = sentence_to_write.split("__,").filter((aasd) => {
          return aasd.length != 0;
        })[0];
        a =
          '<p class="noticem5">Score: ' +
          this.options.result.Score[
            Object.keys(this.options.result.Score)[i]
            ][0] +
          "</p><p>" +
          sentence_to_write +
          "</p>";

        // tslint:disable-next-line: max-line-length
        if (
          this.options.result.Score[
            Object.keys(this.options.result.Score)[i]
            ][0] >= 0.9
        ) {
          a =
            '<p class="noticem8">Score: ' +
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][0] +
            "</p><p>" +
            sentence_to_write +
            "</p>";

          a2 =
            '<p class="noticem8">Score: ' +
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][0] +
            "</p><p>" +
            sentence_to_write +
            "</p>";

          // tslint:disable-next-line: max-line-length
        }
        // tslint:disable-next-line: max-line-length
        else if (
          this.options.result.Score[
            Object.keys(this.options.result.Score)[i]
            ][0] >= 0.7
        ) {
          a =
            '<p class="noticem4">Score: ' +
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][0] +
            "</p><p>" +
            sentence_to_write +
            "</p>";

          a2 =
            '<p class="noticem4">Score: ' +
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][0] +
            "</p><p>" +
            sentence_to_write +
            "</p>";

          // tslint:disable-next-line: max-line-length
        }
        // tslint:disable-next-line: max-line-length
        else if (
          this.options.result.Score[
            Object.keys(this.options.result.Score)[i]
            ][0] >= 0.5
        ) {
          a =
            '<p class="noticem6">Score: ' +
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][0] +
            "</p><p>" +
            sentence_to_write +
            "</p>";

          a2 =
            '<p class="noticem6">Score: ' +
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][0] +
            "</p><p>" +
            sentence_to_write +
            "</p>";

          // tslint:disable-next-line: max-line-length
        }
        // tslint:disable-next-line: max-line-length
        else if (
          this.options.result.Score[
            Object.keys(this.options.result.Score)[i]
            ][0] >= 0.35
        ) {
          a =
            '<p class="noticem5">Score: ' +
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][0] +
            "</p><p>" +
            sentence_to_write +
            "</p>";

          a2 =
            '<p class="noticem5">Score: ' +
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][0] +
            "</p><p>" +
            sentence_to_write +
            "</p>";

          // tslint:disable-next-line: max-line-length
        }
        else {
          a =
            '<p class="noticem7">Score: ' +
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][0] +
            "</p><p>" +
            sentence_to_write +
            "</p>";
          a2 = '';
        }
      }
      else {
        let valorDeA = "";
        let valorDeA2 = "";

        // tslint:disable-next-line: forin
        for (const xd in this.options.result.Score[
          Object.keys(this.options.result.Score)[i]
          ]) {
          let sentence_to_write = this.options.result.SentencesNormalized[
            xd.toString()
            ]
            .split('"')
            .join("''");
          let data_chave = Object.keys(this.options.result.Score)[i];

          let data_chave_replaced_by =
            "<strong>" +
            this.options.result.Score[data_chave][xd][1][0] +
            "</strong>";
          sentence_to_write = sentence_to_write.replace(
            data_chave,
            data_chave_replaced_by
          );
          sentence_to_write = sentence_to_write.replace(
            data_chave.toLowerCase(),
            data_chave_replaced_by
          );
          sentence_to_write = sentence_to_write.replace(
            data_chave.toUpperCase(),
            data_chave_replaced_by
          );

          // tslint:disable-next-line: max-line-length
          d.push({
            x: Object.keys(this.options.result.Score)[i],
            y: this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][xd][0],
            series: xd,
          });

          // tslint:disable-next-line: max-line-length
          if (
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][xd][0] >= 0.9
          ) {
            // tslint:disable-next-line: whitespace
            // tslint:disable-next-line: max-line-length
            valorDeA +=
              '<span title="' +
              sentence_to_write +
              '"><p class="noticem8">Score: ' +
              this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0] +
              "</p><p>" +
              sentence_to_write +
              "</p></span>";

            valorDeA2 +=
              '<span title="' +
              sentence_to_write +
              '"><p class="noticem8">Score: ' +
              this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0] +
              "</p><p>" +
              sentence_to_write +
              "</p></span>";

            // tslint:disable-next-line: max-line-length
            d.push({
              x: Object.keys(this.options.result.Score)[i],
              y: this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0],
              series: xd,
            });
          }
          // tslint:disable-next-line: max-line-length
          else if (
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][xd][0] >= 0.7
          ) {
            // tslint:disable-next-line: whitespace
            // tslint:disable-next-line: max-line-length
            valorDeA +=
              '<span title="' +
              sentence_to_write +
              '"><p class="noticem4">Score: ' +
              this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0] +
              "</p><p>" +
              sentence_to_write +
              "</p></span>";

            valorDeA2 +=
              '<span title="' +
              sentence_to_write +
              '"><p class="noticem4">Score: ' +
              this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0] +
              "</p><p>" +
              sentence_to_write +
              "</p></span>";

            // tslint:disable-next-line: max-line-length
            d.push({
              x: Object.keys(this.options.result.Score)[i],
              y: this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0],
              series: xd,
            });
          }
          // tslint:disable-next-line: max-line-length
          else if (
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][xd][0] >= 0.5
          ) {
            // tslint:disable-next-line: whitespace
            // tslint:disable-next-line: max-line-length
            valorDeA +=
              '<span title="' +
              sentence_to_write +
              '"><p class="noticem6">Score: ' +
              this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0] +
              "</p><p>" +
              sentence_to_write +
              "</p></span>";

            valorDeA2 +=
              '<span title="' +
              sentence_to_write +
              '"><p class="noticem6">Score: ' +
              this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0] +
              "</p><p>" +
              sentence_to_write +
              "</p></span>";

            // tslint:disable-next-line: max-line-length
            d.push({
              x: Object.keys(this.options.result.Score)[i],
              y: this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0],
              series: xd,
            });
          }
          // tslint:disable-next-line: max-line-length
          else if (
            this.options.result.Score[
              Object.keys(this.options.result.Score)[i]
              ][xd][0] >= 0.35
          ) {
            // tslint:disable-next-line: whitespace
            // tslint:disable-next-line: max-line-length
            valorDeA +=
              '<span title="' +
              sentence_to_write +
              '"><p class="noticem5">Score: ' +
              this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0] +
              "</p><p>" +
              sentence_to_write +
              "</p></span>";

            valorDeA2 +=
              '<span title="' +
              sentence_to_write +
              '"><p class="noticem5">Score: ' +
              this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0] +
              "</p><p>" +
              sentence_to_write +
              "</p></span>";

            // tslint:disable-next-line: max-line-length
            d.push({
              x: Object.keys(this.options.result.Score)[i],
              y: this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0],
              series: xd,
            });
          }
          else {
            valorDeA +=
              '<span title="' +
              sentence_to_write +
              '"><p class="noticem7">Score: ' +
              this.options.result.Score[
                Object.keys(this.options.result.Score)[i]
                ][xd][0] +
              "</p><p>" +
              sentence_to_write +
              "</p></span>";
          }
        }
        a = valorDeA;
        a2 = valorDeA2;
      }
      b = Object.keys(this.options.result.Score)[i];

      let nop = d.filter((a) => {
        return a.y > 0.35;
      });
      c2.push({ x: b, y: a2, z: nop });
      c.push({ x: b, y: a, z: d });
      /^\d+$/.test(
        Object.keys(this.options.result.Score)
          [i].substring(0, 10)
          .split("-")
          .join("")
      )
        ? ""
        : c.pop();
      /^\d+$/.test(
        Object.keys(this.options.result.Score)
          [i].substring(0, 10)
          .split("-")
          .join("")
      )
        ? ""
        : c2.pop();

      c2 = c2.filter((y) => {
        return !!y.y;
      });
    }

    // tslint:disable-next-line: forin
    for (const data in c) {
      let data_prov = c[data].x.substring(0, 10).split("-").join(" ");

      const j = Date.parse(data_prov);
      c[data].dateparsed = j;
      data_prov = data_prov.split(" ").join("");
      if (data_prov.length == 6) {
        data_prov += "00";
      }
      if (data_prov.length == 4) {
        data_prov += "0000";
      }
      c[data].dateparsed2 = data_prov;
    }

    // tslint:disable-next-line: forin
    for (const data in c2) {
      let data_prov = c2[data].x.substring(0, 10).split("-").join(" ");
      const j = Date.parse(data_prov);
      c2[data].dateparsed = j;
      data_prov = data_prov.split(" ").join("");
      if (data_prov.length == 6) {
        data_prov += "00";
      }
      if (data_prov.length == 4) {
        data_prov += "0000";
      }
      c2[data].dateparsed2 = data_prov;
    }
    c = c.sort((a, b) => {
      return a.dateparsed - b.dateparsed;
    });
    c2 = c2.sort((a, b) => {
      return a.dateparsed - b.dateparsed;
    });
    c = c.sort((a, b) => {
      return a.dateparsed2 - b.dateparsed2;
    });
    c2 = c2.sort((a, b) => {
      return a.dateparsed2 - b.dateparsed2;
    });

    this.dataset = c;
    this.datasetFixed = this.dataset;

    for (let hu = 0; hu < this.datasetFixed.length; hu++) {
      this.options.result.TempExpressions.map((a) => {
        if (this.datasetFixed[hu].y.search("<d>" + a[0] + "</d>") != -1) {
          this.datasetFixed[hu].y = this.datasetFixed[hu].y.replace(
            "<d>" + a[0] + "</d>",
            a[1]
          );
        }
        if (
          this.datasetFixed[hu].y.search("<d>" + a[0].toUpperCase() + "</d>") !=
          -1
        ) {
          this.datasetFixed[hu].y = this.datasetFixed[hu].y.replace(
            "<d>" + a[0].toUpperCase() + "</d>",
            a[1]
          );
        }
      });
    }

    this.datasetRelOnly = c2;
    this.datasetFixed2 = this.datasetRelOnly;

    for (let hu = 0; hu < this.datasetFixed2.length; hu++) {
      this.options.result.TempExpressions.map((a) => {
        if (this.datasetFixed2[hu].y.search("<d>" + a[0] + "</d>") != -1) {
          this.datasetFixed2[hu].y = this.datasetFixed2[hu].y.replace(
            "<d>" + a[0] + "</d>",
            a[1]
          );
        }
        if (
          this.datasetFixed[hu].y.search("<d>" + a[0].toUpperCase() + "</d>") !=
          -1
        ) {
          this.datasetFixed2[hu].y = this.datasetFixed2[hu].y.replace(
            "<d>" + a[0].toUpperCase() + "</d>",
            a[1]
          );
        }
      });
    }

    this.datasetFixed = this.datasetFixed.filter((cada) => {
      return cada.y.includes("<strong");
    });
    this.datasetFixed2 = this.datasetFixed2.filter((cada) => {
      return cada.y.includes("<strong");
    });

    for (let i = 0; i < this.datasetFixed.length; i++) {
      let score = this.datasetFixed[i].y.split("<\/p>")
      let data = {
        "date": this.datasetFixed[i].x,
        "text": score[1] + "<\/p>",
        "score": score[0] + "<\/p>",
      }
      this.df.push(data)
    }

    for (let i = 0; i < this.datasetFixed2.length; i++) {
      let score = this.datasetFixed2[i].y.split("<\/p>")
      console.log(this.datasetFixed2[i].x)
      let data = {
        "date": this.datasetFixed2[i].x,
        "text": score[1] + "<\/p>",
        "score": score[0] + "<\/p>",
      }
      this.df2.push(data)
    }
    //console.log(this.df)
    //console.log(this.df2)
  }

  updateMultiple() {
    if (this.sortBy == "dates") {
      this.multidocDecoy = this.multidocDates
      //this.multidocSpliced = this.multidocDecoy.splice(0,10)
      //this.multiLen = this.multidocFiles.map(a => a.title).length
    }
    else {
      this.multidocDecoy = this.multidocScores
      //this.multidocSpliced = this.multidocDecoy.splice(0,10)
      //this.multiLen = this.multidocFiles.map(a => a.title).length
    }
    let indexDate = []
    let fakeTopTen = this.topTen
    let score = ''
    let date = ''
    let text = ''

    for (let i = 0; i < fakeTopTen.length; i++) {
      let irrelevant = 0
      for (let j = 0; j < fakeTopTen[i].date.length; j++) {
        if (fakeTopTen[i].dateOG[j].length > 4) {
          if (fakeTopTen[i].text.includes(fakeTopTen[i].dateOG[j])) {
            fakeTopTen[i].text = fakeTopTen[i].text.replace(new RegExp(fakeTopTen[i].dateOG[j], 'g'), "<b>" + fakeTopTen[i].dateOG[j] + "</b>")
            indexDate.push(j);
            text = '<p>' + fakeTopTen[i].text.charAt(0).toUpperCase() + fakeTopTen[i].text.slice(1) + '</p>'
            date = fakeTopTen[i].dateOG[j]
            if (fakeTopTen[i].score >= 0.9) {
              score = '<p class="noticem8">Score: ' + fakeTopTen[i].score + '</p>'
            } else if (this.topTen[i].score >= 0.7) {
              score = '<p class="noticem4">Score: ' + fakeTopTen[i].score + '</p>'
            } else if (this.topTen[i].score >= 0.5) {
              score = '<p class="noticem6">Score: ' + fakeTopTen[i].score + '</p>'
            } else if (this.topTen[i].score >= 0.35) {
              score = '<p class="noticem5">Score: ' + fakeTopTen[i].score + '</p>'
            } else {
              score = '<p class="noticem7">Score: ' + fakeTopTen[i].score + '</p>'
              irrelevant = 1
            }
            break;
          }
        }
      }
      if (indexDate.length == i) {
        for (let j = 0; j < fakeTopTen[i].date.length; j++) {
          irrelevant = 0
          if (fakeTopTen[i].text.includes(this.topTen[i].dateOG[j])) {
            fakeTopTen[i].text = fakeTopTen[i].text.replace(new RegExp(fakeTopTen[i].dateOG[j], 'g'), "<b>" + fakeTopTen[i].dateOG[j] + "</b>")
            indexDate.push(j);
            text = '<p>' + fakeTopTen[i].text.charAt(0).toUpperCase() + fakeTopTen[i].text.slice(1) + '</p>'
            date = fakeTopTen[i].dateOG[j]
            if (fakeTopTen[i].score >= 0.9) {
              score = '<p class="noticem8">Score: ' + fakeTopTen[i].score + '</p>'
            } else if (this.topTen[i].score >= 0.7) {
              score = '<p class="noticem4">Score: ' + fakeTopTen[i].score + '</p>'
            } else if (this.topTen[i].score >= 0.5) {
              score = '<p class="noticem6">Score: ' + fakeTopTen[i].score + '</p>'
            } else if (this.topTen[i].score >= 0.35) {
              score = '<p class="noticem5">Score: ' + fakeTopTen[i].score + '</p>'
            } else {
              score = '<p class="noticem7">Score: ' + fakeTopTen[i].score + '</p>'
              irrelevant = 1
            }
            break;
          }
        }
      }
      if (indexDate.length == i) {
        indexDate.push(0);
      }
      //const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
      // date = new Date(date).toLocaleDateString('pt-PT', options)
      let dayDate, monthDate, yearDate = 0
      let token = 0
      if (date.length == 8 || date.length == 10) {
        token = 1
        if (date.includes('.')) {
          dayDate = parseInt(date.split('.')[0])
          monthDate = parseInt(date.split('.')[1]) - 1
          yearDate = parseInt(date.split('.')[2])
        }
        else if (date.includes('/')) {
          dayDate = parseInt(date.split('/')[0])
          monthDate = parseInt(date.split('/')[1]) - 1
          yearDate = parseInt(date.split('/')[2])
        }
        else if (date.includes('-')) {
          dayDate = parseInt(date.split('-')[0])
          monthDate = parseInt(date.split('-')[1]) - 1
          yearDate = parseInt(date.split('-')[2])
        }
      }
      else if (date.length == 4) {
        dayDate = 0o1
        monthDate = 0o0
        yearDate = parseInt(date)
      }
      else if (date.length == 7 || date.length == 9) {
        if (date.includes('.')) {
          dayDate = 0o1
          monthDate = 0o0
          yearDate = parseInt(date.split('.')[0])
        }
        else if (date.includes('/')) {
          dayDate = 0o1
          monthDate = 0o0
          yearDate = parseInt(date.split('/')[0])
        }
        else if (date.includes('-')) {
          dayDate = 0o1
          monthDate = 0o0
          yearDate = parseInt(date.split('-')[0])
        }
      }

      let fakeDate = ''
      if (token == 1) {
        fakeDate = new Date(yearDate,monthDate,dayDate).toLocaleDateString('pt-PT')
        date = new Date(yearDate,monthDate,dayDate).toLocaleDateString('pt-PT')
      }
      else {
        fakeDate = new Date(yearDate,monthDate,dayDate).toLocaleDateString('pt-PT')
      }

      let data = {
        // @ts-ignore
        "date": date,
        "fakeDate": fakeDate,
        "text": text,
        "score": score,
      }
      if (irrelevant == 1) {
        this.multidf.push(data)
      }
      else {
        this.multidf.push(data)
        this.multidf2.push(data)
      }
    }

    this.multidf.sort(function(a, b){
      const aa = a.fakeDate.split('/').reverse().join(),
        bb = b.fakeDate.split('/').reverse().join();
      return aa < bb ? -1 : (aa > bb ? 1 : 0);
    });

    this.multidf2.sort(function(a, b){
      const aa = a.fakeDate.split('/').reverse().join(),
        bb = b.fakeDate.split('/').reverse().join();
      return aa < bb ? -1 : (aa > bb ? 1 : 0);
    });
  }

  startSingleNarr(url) {
    console.log("STARTING SINGLE DOC: " + url)
    this.urlSingleNarr = url;
    this.singleNarr = true;
    this.loadingSingleNarr = true;
    this.errorSingleNarr = false;

    this.timeline
      .getTextKeyDateFromUrl(this.urlSingleNarr, this.singleNarrOptions)
      .pipe(
        timeout(15000),
        catchError(err => {
          console.log('Time-Matters Error: ', err);
          this.errorSingleNarr  = true
          this.loadingSingleNarr = false;
          return " ";
        }),
        take(1))
      .subscribe((res) => {
        if (res.message === "success") {
          console.log(res)
          this.resultSingleNarr = res;
          let finalText = this.formatText(this.resultSingleNarr.TextNormalized).replace(new RegExp('%','g'),'');
          this.wikifier
            .getWikifier(finalText)
            .pipe(
              timeout(10000),
              catchError(err => {
                console.log('Wikifier Error: ', err);
                this.errorWikifierSingleNarr = true;
                this.loadingSingleNarr = false;
                this.singleNarrOptions = {
                  docCreateTime: "",
                  dateGranularity: "full",
                  score: "doc",
                  algorithm: "py_heideltime",
                  ngram: 1,
                  language: "Portuguese",
                  numberOfKeywords: 30,
                  nContextualWindow: true,
                  documentType: "news",
                  n: "max",
                  result: this.resultSingleNarr,
                  dateBegin: 0,
                  dateEnd: 2100,
                  tH: 0.05,
                };
                this.options = this.singleNarrOptions
                this.updateSingle()
                this.finishSingleNarr = true
                return " ";
              }),
              take(1))
            .subscribe((res) => {
              console.log(res)
              if (!res.error) {
                this.wikiSingleNarr = res;
              }
              else {
                //console.log("ERROR")
              }
              this.loadingSingleNarr = false;
              this.singleNarrOptions = {
                docCreateTime: "",
                dateGranularity: "full",
                score: "doc",
                algorithm: "py_heideltime",
                ngram: 1,
                language: "Portuguese",
                numberOfKeywords: 30,
                nContextualWindow: true,
                documentType: "news",
                n: "max",
                result: this.resultSingleNarr,
                dateBegin: 0,
                dateEnd: 2100,
                tH: 0.05,
              };
              this.options = this.singleNarrOptions
              this.updateSingle()
              this.finishSingleNarr = true
              return " ";
            });
          //dbpedia
        }
        else {
          this.errorSingleNarr  = true
          this.loadingSingleNarr = false;
          return " ";
        }
      });
  }

  endSingleDoc() {
    this.singleNarr = false;
  }

  formatText(text) {
    let newText = text.replace(/<kw>/g, '')
    newText = newText.replace(/<\/kw>/g, '')
    newText = newText.replace(/<d>/g, '')
    newText = newText.replace(/<\/d>/g, '')
    return newText
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

  changeSortToggle() {
    if (this.sortBy == "dates") {
      this.sortBy = "scores"
    }
    else {
      this.sortBy = "dates"
    }
    this.updateMultiple()
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

  toggleKeywords() {
    this.withKeywords = !this.withKeywords;
    if (this.withKeywords) {
      this.withKeywordsSentence = "Keywords Off";
    } else {
      this.withKeywordsSentence = "Keywords On";
    }
  }

  toggleEntities() {
    this.withEntities = !this.withEntities;
    if (this.withEntities) {
      this.withEntitiesSentence = "Entities Off";
    }
    else {
      this.withEntitiesSentence = "Entities On";
    }
  }

  toggleRelAT() {
    this.showOnlyRelAT = !this.showOnlyRelAT;
  }

  toggleRelTC() {
    this.showOnlyRelTC = !this.showOnlyRelTC;
  }

  goBack() {
    this.toBack.emit(null);
  }

  openArquivo(url) {
    window.open(url, '_blank');
  }

  openDialog() {
    this.dialog.open(VideoComponent, { height: "90%", width: "100%" });
  }
}
