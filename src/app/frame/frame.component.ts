import {Component, Input, OnChanges} from "@angular/core";

@Component({
  selector: "app-frame",
  templateUrl: "./frame.component.html",
  styleUrls: ["./frame.component.css"],
})

export class FrameComponent implements OnChanges {
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

  ngOnChanges() {
    this.textNormalized = this.args.TextNormalized;
    this.keywordScores = this.args.RelevantKWs;
    this.dateScores = this.args.Score;
    this.text = this.textNormalized;

    if (!this.errorWikifier) {
      this.markWikiData()
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
    let maxMention = 0
    for (let i = 0; i < this.wiki.annotations.length; i++) {
      let support = this.wiki.annotations[i].support
      maxMention = 0
      for (let j = 0; j < support.length; j++) {
        let pMention = support[j].pMentionGivenSurface
        //console.log(this.wiki.annotations[i].title + " : " + pMention)
        if (pMention > 0.50 && pMention > maxMention) {
          maxMention = pMention
        }
      }
      if (maxMention != 0) {
        let data = {
          "title": this.wiki.annotations[i].title,
          "url": this.wiki.annotations[i].url,
          "class": this.wiki.annotations[i].wikiDataClasses?.length > 0 ? this.wiki.annotations[i].wikiDataClasses[0].enLabel : "",
          "image": "",
          "text": ""
        }
        this.wikiData.push(data)
      }
    }

    if (this.entitiesMatter) {
      this.text = this.formatText(this.textNormalized)
      for (let i = 0; i < this.wikiData.length; i++) {
        if (this.wikiData[i].title.split(' ').length > 1) {
          this.text = this.text.replace(new RegExp(this.wikiData[i].title,'gi'), "<a class='darkblue' target='_blank' href='" + this.wikiData[i].url + "'><b>" + this.wikiData[i].title + "</b></a>")
        }
        else {
        }
      }
      for (let i = 0; i < Object.keys(this.keywordScores).length; i++) {
        this.text = this.text.replace(new RegExp(">" + Object.keys(this.keywordScores)[i],'g'), "><kw>" + Object.keys(this.keywordScores)[i] + "</kw>")
        this.text = this.text.replace(new RegExp(" " + Object.keys(this.keywordScores)[i],'g'), " <kw>" + Object.keys(this.keywordScores)[i] + "</kw>")
      }
    }

    /* dbpedia
    if (this.entitiesMatter) {
      this.text = this.dbpedia.replace(new RegExp('dbpedia.org/resource','g'), 'wikipedia.org/wiki')
      for (let i = 0; i < Object.keys(this.keywordScores).length; i++) {
        this.text = this.text.replace(new RegExp(Object.keys(this.keywordScores)[i],'g'), "<kw>" + Object.keys(this.keywordScores)[i] + "</kw>")
      }
    }
    */

    this.displayText()
  }

  getAllIndexes(val) {
    let indexes = [], i = -1;
    while ((i = this.text.indexOf(val, i+1)) != -1){
      indexes.push(i);
    }
    return indexes;
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
            color = "black";
          }
          else {
            color = "red";
            if (title < 0.5) {
              color = "green";
            } else if (title >= 0.5) {
              color = "blue";
              if (title > 0.7) {
                color = "yellow";
              }
              if (title > 0.9) {
                color = "purple";
              }
            }
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
          if (this.showOnlyRelevants && (color === "black" || color === "green")) {
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
          if (this.showOnlyRelevants && (objecto[0].color === "black"||objecto[0].color === "green")) {
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

              if (title * 1 < 0.35 && title * 1 >= 0) {
                color = "black";
              }
              else {
                color = "red";
                if (title < 0.5) {
                  color = "green";
                }
                else if (title >= 0.5) {
                  color = "blue";
                  if (title > 0.7) {
                    color = "yellow";
                  }
                  if (title > 0.9) {
                    color = "purple";
                  }
                }
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
                if (color === "black" || color === "green") {
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
