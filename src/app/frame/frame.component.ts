import {Component, Input, OnChanges, OnInit} from "@angular/core";

@Component({
  selector: "app-frame",
  templateUrl: "./frame.component.html",
  styleUrls: ["./frame.component.css"],
})

export class FrameComponent implements OnInit, OnChanges {
  @Input() errorWikifier: boolean;
  @Input() score: any;
  @Input() args: any;
  @Input() keywordsMatter: any;
  @Input() entitiesMatter: any;
  @Input() showOnlyRelevants: boolean;
  @Input() wiki: any;
  @Input() dbpedia: any;
  @Input() freeText: any;

  public textNormalized: any;
  public keywordScores: any;
  public dateScores: any;
  public text: string;
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
  }

  ngOnInit() {
    this.markWikiData()
    this.ngOnChanges()
  }

  ngOnChanges() {
    this.textNormalized = this.args.TextNormalized;
    this.keywordScores = this.args.RelevantKWs;
    this.dateScores = this.args.Score;
    this.text = this.textNormalized;

    if (this.entitiesMatter) {
      this.displayEntities()
    }
    else {
      this.displayText()
    }
  }

  formatText(text) {
    let newText = text.replace(/<kw>/g, '')
    newText = newText.replace(/<\/kw>/g, '')
    return newText
  }

  markWikiData() {
    let maxRank = 0
    let minRank = 1
    let totRank = 0
    let avgRank: number

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

  displayEntities() {
    this.text = this.formatText(this.textNormalized)
    for (let i = 0; i < this.wikiData.length; i++) {
      if (!this.text.includes(">" + this.wikiData[i].title + "<")
        && !this.text.includes("/" + this.wikiData[i].title)
        && !this.text.includes("_" + this.wikiData[i].title + "'")
        && !this.text.includes("_" + this.wikiData[i].title + "_")) {
        this.text = this.text.replace(new RegExp(this.wikiData[i].title,'gi'), "<a class='darkblue' target='_blank' href='" + this.wikiData[i].url + "'><b>" + this.wikiData[i].title + "</b></a>")
      }
    }
    for (let i = 0; i < Object.keys(this.keywordScores).length; i++) {
      if (!this.wikiData.map(a => a.title).includes(Object.keys(this.keywordScores)[i])) {
        this.text = this.text.replace(new RegExp(" " + Object.keys(this.keywordScores)[i],'gi'), " <kw>" + Object.keys(this.keywordScores)[i] + "</kw>")
      }
    }
    this.displayText()
  }

  displayText() {
    if (this.score == "doc") {
      if (this.args) {
        const a = [];
        let ind = 0;

        this.text = this.text.replace(/<d>(.*?)<\/d>/gi, (x) => {

          let valor = x.replace(/<d>/, "");
          valor = valor.substring(0, valor.length - 4);
          let title
          if (this.freeText) {
            let f1 = this.dateScores[valor.toLowerCase()]
            title = f1[Object.keys(this.dateScores[valor.toLowerCase()])[0]];
          }
          else {
            title = this.dateScores[valor.toLowerCase()];
          }

          let color = "";
          if (title) {
            title = title[0];
          }
          else {
            title = "Error";
          }

          if (title < 0.35) {
            color = "red";
          }
          else if (title >= 0.35 && title < 0.5) {
            color = "orange";
          }
          else if (title >= 0.5 && title < 0.7) {
            color = "yellow";
          }
          else if (title >= 0.7 && title < 0.9) {
            color = "green";
          }
          else {
            color = "darkgreen";
          }

          if (a.length != 0) {
            let exists = false;
            let maxElement = 0;
            a.map((allElementsInA) => {
              if (allElementsInA.valor == valor) {
                maxElement = allElementsInA.index;
                exists = true;
              }
            });
            if (exists) {
              a.push({
                valor,
                index: maxElement + 1,
                ind,
                color,
                title,
              });
            }
            else {
              a.push({
                valor,
                index: 0,
                ind,
                color,
                title,
              });
            }
          }
          else {
            a.push({
              valor,
              index: 0,
              ind,
              color,
              title,
            });
          }

          let thing = a.map((elementInA) => {
            if (elementInA.ind == ind && elementInA.valor == valor) {
              return elementInA.index;
            }
          });

          ind++;
          if (this.showOnlyRelevants && (color === "black" || color === "red")) {
            x = x;
          }
          else {
            x =
              '<span title="' +
              title +
              '">' +
              '<b class="' +
              color +
              '">' +
              x +
              "</b>" +
              "</span>";
          }
          return x;
        });

        ind = 0;
        this.text = this.text.replace(/<d>(.*?)<\/d>/gi, (x) => {
          let objecto = a.filter((each) => {
            return each.ind == ind;
          });
          let filteredstuff = this.args.TempExpressions.filter((cada) => {
            return cada[0] == objecto[0].valor;
          });
          let repl_sentence = filteredstuff[objecto[0].index][1];
          ind++;
          if (this.showOnlyRelevants && (objecto[0].color === "black"||objecto[0].color === "red")) {
            repl_sentence = repl_sentence;
          }
          else {
            repl_sentence = //
              '<span title="' +
              objecto[0].title +
              '">' +
              '<b class="' +
              objecto[0].color +
              '">' +
              repl_sentence +
              //textoAEscrever +
              "</b>" +
              "</span>";
          }
          return repl_sentence;
        });

        if (this.keywordsMatter) {
          this.text = this.text.replace(/<kw>(.*?)<\/kw>/gi, (x) => {
            let valor = x.replace(/<kw>/, "");
            valor = valor.substring(0, valor.length - 5);
            let title = this.keywordScores[valor];

            if (title) {
              title = Math.floor(title * 1000);
              title /= 1000;
            }
            else {
              title = "Error";
            }
            x =
              '<span title="' +
              title +
              '">' +
              "<b>" +
              x.substring(4, x.length - 5) +
              "</b>" +
              "</span>";
            return x;
          });
        }
      }
    }
    else {
      if (this.args) {
        this.keywordScores = this.args.RelevantKWs;
        this.dateScores = this.args.Score;
        this.text = "";
        let frases = this.args.SentencesNormalized;
        let frases2 = [];

        // tslint:disable-next-line: whitespace
        // tslint:disable-next-line: forin
        for (let fraseIndex = 0; fraseIndex < frases.length; fraseIndex++) {
          frases2[fraseIndex] = frases[fraseIndex].replace(
            /<d>(.*?)<\/d>/gi,
            (x) => {
              let valor = x.replace(/<d>/, "");
              valor = valor.substring(0, valor.length - 4);
              let title = this.dateScores[valor.toLowerCase()][fraseIndex][0];
              let color = "";
              if (title) {
              }
              else {
                title = this.dateScores[valor.toLowerCase()][fraseIndex]["0"];
              }

              if (title < 0.35) {
                color = "red";
              }
              else if (title >= 0.35 && title < 0.5) {
                color = "orange";
              }
              else if (title >= 0.5 && title < 0.7) {
                color = "yellow";
              }
              else if (title >= 0.7 && title < 0.9) {
                color = "green";
              }
              else {
                color = "darkgreen";
              }

              let dispon = this.dateScores[x.substring(3, x.length - 4).toLowerCase()];
              let valorSpan = dispon[fraseIndex.toString()][0];
              let textoAEscrever = "";
              for (let lk in this.args.TempExpressions) {
                if (
                  this.args.TempExpressions[lk][0] ===
                  x.substring(3, x.length - 4)
                ) {
                  textoAEscrever = this.args.TempExpressions[lk][1];
                }
              }

              if (this.showOnlyRelevants) {
                if (color === "black" || color === "red") {
                  x = textoAEscrever;
                } else {
                  x =
                    '<span title="' +
                    valorSpan +
                    '">' +
                    '<b class="' +
                    color +
                    '">' +
                    textoAEscrever +
                    "</b>" +
                    "</span>";
                }
              }
              else {
                x =
                  '<span title="' +
                  valorSpan +
                  '">' +
                  '<b class="' +
                  color +
                  '">' +
                  textoAEscrever +
                  "</b>" +
                  "</span>";
              }
              return x;
            }
          );
          this.text = frases2.join("");
        }

        if (this.keywordsMatter) {
          this.text = this.text.replace(/<kw>(.*?)<\/kw>/gi, (x) => {
            let valor = x.replace(/<kw>/, "");
            valor = valor.substring(0, valor.length - 5);
            let title = this.keywordScores[valor];

            if (title) {
              title = Math.floor(title * 1000);
              title /= 1000;
            }
            else {
              title = "Error";
            }
            x =
              '<span title="' +
              title +
              '">' +
              "<b>" +
              x.substring(4, x.length - 5) +
              "</b>" +
              "</span>";
            return x;
          });
        }
      }
    }
  }
}
