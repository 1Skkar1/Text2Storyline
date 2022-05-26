import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimelineService } from "../services/timeline.service";
import { WikifierService } from "../services/wikifier.service";
import { YakeService } from "../services/yake.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { catchError, take, timeout } from "rxjs/operators";
import { VideoComponent } from "../video/video.component";


@Component({
  selector: 'app-freetext',
  templateUrl: './freetext.component.html',
  styleUrls: ['./freetext.component.css']
})
export class FreetextComponent implements OnInit {
  public result: any;
  public requestMade: boolean;
  public requestReceived: boolean;
  public withKeywords: boolean;
  public withKeywordsSentence: string;
  public withEntities: boolean;
  public withEntitiesSentence: string;
  public picker: any;
  public maxValTH: number;
  public hiddenoption: boolean;
  public conteudoDefault: string;
  public loading: boolean;
  public algoritmosDate: Array<any>;
  public algoritmoSelected: string;
  public dateGranularityOptions: Array<string>;
  public dateGranularitySelected: string;
  public documentTypeOptions: Array<any>;
  public documentTypeSelected: string;
  public documentCreationTime: string;
  public languageOptions: Array<string>;
  public languagueSelected: string;
  public dateBegin: number;
  public dateEnd: number;
  public byDocOrSentece: boolean;
  public hiddenoptionKW: boolean;
  public hiddenoptionTM: boolean;
  public ngramSelected: number;
  public listaConteudos: Array<string>;
  public optio: any;
  public dataset: any;
  public datasetFixed: any;
  public datasetFixed2: any;
  public datasetRelOnly: any;
  public numberOfKeyWords: number;
  public contextWindow: any;
  public simbaValue: number;
  public cheating: boolean;
  public showOnlyRel: boolean;
  public showOnlyRelSnap: boolean;
  public differentValues: Array<any>;
  public differentRelValues: Array<any>;
  public contextFullSentence: boolean;
  public simbaValueMax: boolean;
  public TH: number;
  public exe_time_total: string;
  public exe_time_YAKE: string;
  public exe_time_algo: string;
  public exe_time_GTE: string;
  public numero_total: number;
  public numero_total2: number;
  public right: string;
  public oops: boolean;
  public errorWikifier: boolean;
  public wiki: any;
  public df: any;
  public df2: any;

  constructor(
    private router: Router,
    private yake: YakeService,
    private timeline: TimelineService,
    private wikifier: WikifierService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.oops = false;
    this.ngramSelected = 1;
    this.right = "right";
    this.byDocOrSentece = true;
    this.result = "";
    this.differentRelValues = [];
    this.differentValues = [];
    this.requestMade = false;
    this.withKeywords = false;
    this.withKeywordsSentence = "Keywords Off";
    this.withEntities = true;
    this.withEntitiesSentence = "Entities Off";
    this.hiddenoption = false;
    this.hiddenoptionKW = true;
    this.hiddenoptionTM = false;
    this.loading = false;
    this.contextFullSentence = true;
    this.simbaValueMax = true;
    // tslint:disable-next-line: max-line-length
    this.listaConteudos = [
      "2011 Haiti Earthquake Anniversary. As of 2010 (see 1500 photos here), the following major earthquakes have been recorded in Haiti. The first great earthquake mentioned in histories of Haiti occurred in 1564 in what was still the Spanish colony. It destroyed Concepción de la Vega. On January 12, 2010, a massive earthquake struck the nation of Haiti, causing catastrophic damage inside and around the capital city of Port-au-Prince. On the first anniversary of the earthquake, 12 January 2011, Haitian Prime Minister Jean-Max Bellerive said the death toll from the quake in 2010 was more than 316,000, raising the figures in 2010 from previous estimates. I immediately flashed back to the afternoon of February 11, 1975 when, on my car radio, I first heard the news. Yesterday...",
      `Pour ces nombreux accomplissements ainsi que son remarquable engagement  dans le projet européen, Helmut Kohl a reçu en 1998, la prestigieuse distinction de citoyen d'honneur de l'Europe, par le Conseil Européen de Vienne. Cette distinction européenne est l'une des plus honorifiques car elle est décernée au nom de toute l'Union Européenne pour récompenser l'investissement des personnalités qui ont permis de mener à bien le projet européen. Seul 2 autres personnes ont été distinguées par cette décoration: Jean Monnet en 1976 et Jacques Delors en 2015.`,

      `Champions: le possibili avversarie ai Quarti.  Conclusi gli Ottavi di finale, è ora definito il quadro delle otto "grandi d'Europa" che si sfideranno nei Quarti di Champions League 2016/2017. L'appuntamento con l'urna di Nyon è per oggi, venerdì 17 marzo, alle ore 12, con la Juventus che se la vedrà con una tra le tre formazioni spagnole (Atlético Madrid, Barcellona e Real Madrid); i tedeschi di Bayern Monaco e Borussia Dortmund; gli inglesi del Leicester o i transalpini del Monaco. A questo riguardo, andiamo ad analizzare alcune statistiche e curiosità relative ai precedenti tra i Bianconeri e i possibili avversari nei Quarti di finale.`,

      `Entre tantos acontecimentos marcantes de 2016, um dos que mais impactaram o país e o Congresso Nacional foi o  impeachment da presidente Dilma Rousseff. O processo caracterizou-se por polêmica e divergência de opiniões no Parlamento e na sociedade, o que o diferencia do ocorrido com Fernando Collor, em 1992.
    Os casos de impeachment de Dilma e Collor podem ser caracterizados por momento de crise econômica e baixa popularidade dos presidentes. Dilma, no início, contava com ampla base aliada do Congresso, o que foi diminuindo ao longo do julgamento. Já Collor governou com baixo apoio parlamentar. Dilma teve forte apoio de movimentos sociais e de organizações sindicais, como a Central Única dos Trabalhadores (CUT), que organizou manifestações contrárias ao impedimento. Na época de Collor, movimentos e entidades da sociedade foram favoráveis à queda do presidente.
    O processo de impeachment de Dilma Rousseff teve início em 2 de dezembro de 2015, quando o ex-presidente da Câmara dos Deputados Eduardo Cunha deu prosseguimento ao pedido dos juristas Hélio Bicudo, Miguel Reale Júnior e Janaína Paschoal. Com uma duração de 273 dias, o caso se encerrou em 31 de agosto de 2016, tendo como resultado a cassação do mandato, mas sem a perda dos direitos políticos de Dilma.
    Na justificação para o pedido de impeachment, os juristas alegaram que a então presidente havia cometido crime de responsabilidade pela prática das chamadas "pedaladas fiscais" e pela edição de decretos de abertura de crédito sem a autorização do Congresso.
    A acusação argumentou que os decretos autorizaram suplementação do orçamento em mais de R$ 95 bilhões e contribuíram para o descumprimento da meta fiscal de 2015. Disseram que o governo sabia da irregularidade porque já havia pedido revisão da meta quando editou os decretos e que o Legislativo não tinha sido consultado, como deveria ter sido feito antes da nova meta ser aprovada.
    Em relação às pedaladas, a acusação disse que não foram apenas atrasos operacionais porque o débito do Tesouro com os bancos públicos se acumulou por longo tempo e chegou a valores muito altos. Segundo os juristas, o acúmulo dos débitos serviu para fabricar superavit fiscal que não existia e para criar uma situação positiva das contas públicas que não era verdadeira. O objetivo das "pedaladas", como afirmaram, teria sido, portanto, esconder a real situação fiscal do país.
    A defesa, por sua vez, afirmou que os decretos de crédito suplementar foram baseados em remanejamento de recursos, excesso de arrecadação ou superavit financeiro, ou seja, não significaram aumento de despesa. Para os defensores de Dilma, os atrasos no pagamento da equalização de taxas de juros do Plano Safra não podiam ser considerados empréstimos porque o dinheiro é emprestado aos agricultores e não ao governo
    `,

      `The Boston Marathon bombing was a terrorist attack, followed by subsequent related shootings, that occurred when two pressure cooker bombs exploded during the Boston Marathon on April 15, 2013. The bombs exploded about 12 seconds and 210 yards (190 m) apart at 2:49 pm EDT, near the marathon's finish line on Boylston Street. The explosion killed 3 civilians and injured an estimated 264 others.
    The Federal Bureau of Investigation (FBI) took over the investigation and, on April 18, released photographs and a surveillance video of two suspects. The suspects were identified later that day as Chechen brothers Dzhokhar Tsarnaev and Tamerlan Tsarnaev. Shortly after the FBI released identifying images publicly, the suspects killed an MIT policeman, carjacked a civilian SUV, and initiated an exchange of gunfire with the police in nearby Watertown. During the firefight, a Massachusetts Bay Transportation Authority Police officer was injured but survived with severe blood loss. A Boston Police Department officer was also injured and died from his wounds nearly a year later. Tamerlan Tsarnaev was shot several times in the firefight and his brother subsequently ran him over with the stolen SUV in his escape. Tamerlan died shortly after arriving at Boston's Beth Israel Hospital.
    An unprecedented manhunt for Dzhokhar Tsarnaev ensued on April 19, with thousands of law enforcement officers searching a 20-block area of Watertown. During the manhunt, authorities asked residents of Watertown and surrounding areas, including Boston, to stay indoors. The public transportation system and most businesses and public institutions were shut down, creating a deserted urban environment of historic size and duration. Around 6:00 p.m., shortly after the "shelter-in-place" advisory was rescinded, a Watertown resident discovered Dzhokhar hiding in a boat in his back yard. Reports conflict as to whether or not he was armed. Located within the boat by thermal imaging, he was shot while in the boat, arrested, and then taken to a hospital shortly thereafter.
    During an initial interrogation in the hospital, Dzhokhar alleged that Tamerlan was the mastermind. He said they were motivated by extremist Islamist beliefs and the wars in Iraq and Afghanistan, and that they were self-radicalized and unconnected to any outside terrorist groups. According to him, they learned to build explosive devices from an online magazine of the al-Qaeda affiliate in Yemen. He said that he and his brother had decided after the Boston bombing to travel to New York City to bomb Times Square. Dzhokhar was indicted on April 22, while still in the hospital, on 30 charges relating to homegrown terrorism, including use of a weapon of mass destruction and malicious destruction of property resulting in death. He was found guilty on all charges on April 8, 2015, and the following month was sentenced to death.`,
    ];
    this.conteudoDefault = this.listaConteudos[3];
    this.algoritmosDate = [
      [
        "py_heideltime",
        "makes use of Heideltime temporal tagger to detect a range of diferente temporal expressions",
      ],
      [
        "py_rule_based",
        "a simple rule-based approach that only takes into account dates in the format of dddd (e.g., 2021)",
      ],
    ];
    this.algoritmoSelected = this.algoritmosDate[0][0];
    this.dateGranularityOptions = ["full", "year", "month", "day"];
    this.dateGranularitySelected = this.dateGranularityOptions[0];
    this.documentTypeOptions = [
      ["news", "news-style documents (document creation time should be provided whenever possible)"],
      ["narrative", "narrative-style documents (e.g., Wikipedia articles)"],
      ["colloquial", "non-standard language (e.g., tweets or SMS)"],
      ["scientific", "documents with a local time frame (e.g., clinical trials)"],
    ];
    this.documentTypeSelected = this.documentTypeOptions[0][0];
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
    this.languagueSelected = this.languageOptions[0];
    this.maxValTH = 1;
    this.dateBegin = 0;
    this.dateEnd = 2100;
    this.numberOfKeyWords = 30;
    this.contextWindow = "full_sentence";
    this.simbaValue = 10;
    this.cheating = false;
    this.showOnlyRel = true;
    this.showOnlyRelSnap = true;
    this.TH = 0.05;
    this.wiki = [];
    this.df = [];
    this.df2 = [];
  }

  ngOnInit() {
    this.oops = false;
    this.errorWikifier = false;
  }

  openDialog() {
    this.dialog.open(VideoComponent, { height: "90%", width: "100%" });
  }

  toggleOptionKeywords() {
    this.hiddenoptionKW = !this.hiddenoptionKW;
  }

  toggleTimeMattersOptions() {
    this.hiddenoptionTM = !this.hiddenoptionTM;
  }

  toggleRel() {
    this.showOnlyRel = !this.showOnlyRel;
    //this.showOnlyRelSnap = this.showOnlyRel;
  }

  changeTH(event: any) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    // console.log(event);
    if (event.source) {
      this.TH = event.value;
      return;
    } else {
      if (event.target.value) {
        if (event.target.value > this.maxValTH) {
          this.TH = 1;
          return;
        }
        event.preventDefault();
        this.TH = event.target.value;
      } else {
        this.TH = 0;
        return;
      }
    }
    this.update();
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

  toggleDocOrSentence() {
    this.byDocOrSentece = !this.byDocOrSentece;
  }

  toggleOption() {
    this.hiddenoption = !this.hiddenoption;
  }

  deleteContent(event: any) {
    this.conteudoDefault = "";
  }

  selecionarDataReferencia(event: any) {
    this.documentCreationTime = event.target.value;
    //  console.log("DATA!");
    // console.log(event.target.value);
  }

  maxSimba(event: any) {
    // console.log("simba");
    // console.log(event.checked);
    this.simbaValueMax = event.checked;
  }

  selecionarNKeywords(event: any) {
    this.numberOfKeyWords = event.target.value;
    // console.log(event.target.value);
  }

  selecionarGranularidade(event: any) {
    // console.log("entrou mudar granularidade");
    this.dateGranularitySelected = event;
    // console.log(event);
  }

  selecionarAlgoritmo(event: any) {
    this.algoritmoSelected = event;
    this.documentCreationTime = "";
  }

  fullSentence(event: any) {
    this.contextFullSentence = event.checked;
  }

  selecionarContextualWindow(event: any) {
    this.contextWindow = event.target.value;
  }

  selecionarLanguage(event: any) {
    this.languagueSelected = event;
  }

  setDefaultText(num: number, language: string) {
    this.selecionarLanguage(language);
    this.conteudoDefault = this.listaConteudos[num];
  }

  setDefaultTexto(texto: any) {
    this.conteudoDefault = texto.value;
  }

  public copyToClipboard(event: any) {
    event.preventDefault();
    if (!this.withKeywords) {
      this._snackBar.open(
        "Message copied to Clipboard",
        "Length: " + this.result.TextNormalized.length + " characters",
        {
          duration: 2000,
        }
      );
      const clipboard = document.createElement("input");
      clipboard.setAttribute("value", this.result.TextNormalized);
      document.body.appendChild(clipboard);
      clipboard.select();
      document.execCommand("copy");
      document.body.removeChild(clipboard);
    }
    else {
      this._snackBar.open(
        "Message copied to Clipboard",
        "Length: " +
        this.result.TextNormalized.split("<kw>")
          .join("")
          .split("</kw>")
          .join("").length +
        " characters",
        {
          duration: 2000,
        }
      );
      const clipboard = document.createElement("input");

      clipboard.setAttribute(
        "value",
        this.result.TextNormalized.split("<kw>")
          .join("")
          .split("</kw>")
          .join("")
      );
      document.body.appendChild(clipboard);
      clipboard.select();
      document.execCommand("copy");
      document.body.removeChild(clipboard);
    }
  }

  goBack() {
    this.result = false;
    this.requestMade = false;
    this.loading = false;
    this.languagueSelected = this.languageOptions[0];
    this.withKeywords = true;
    this.withKeywordsSentence = "Keywords Off";
    this.oops=false;
  }

  public update() {
    if (this.result) {
      let last = "";
      this.numero_total = this.result.TempExpressions.length;
      this.numero_total2 = this.result.TempExpressions.filter((cada) => {
        let f1 = this.result.Score[cada[0].toLowerCase()];
        return f1[Object.keys(this.result.Score[cada[0].toLowerCase()])[0]][0] > 0.5;
      }).length;
      last = "";
      this.differentValues = this.result.TempExpressions.sort(
        (a, b) => a[0] - b[0]
      ).filter((element, index, array) => {
        if (index == 0) {
          last = element[0];
          return /^\d+$/.test(element[0].toString().split("-").join(""));
        }
        else {
          let este = last;
          last = element[0];
          return (
            element[0].toString().split("-").join("") != este &&
            /^\d+$/.test(element[0].toString().split("-").join(""))
          );
        }
      });

      if (this.byDocOrSentece) {
        this.differentRelValues = this.differentValues.filter(
          (element, index, array) => {
            const a = element[0].toLowerCase() + "";
            let f1 = this.result.Score[a];
            return f1[Object.keys(this.result.Score[a])[0]][0] > 0.5;
          }
        );
      }
      else {
        this.differentRelValues = this.differentValues.map((a) => {
          return this.result.Score[a[0]];
        });

        let valores = Object.keys(this.result.Score);
        let total2 = 0;
        valores.map((kelp) => {
          Object.keys(this.result.SentencesTokens).map((kolp) => {
            if (this.result.Score[kelp][kolp + ""]) {
              if (this.result.Score[kelp][kolp + ""][0] > 0.5) {
                total2++;
              }
            }
          });
        });
        this.numero_total2 = total2;
        valores = Object.keys(this.result.Score);
        total2 = 0;
        valores.map((kelp) => {
          Object.keys(this.result.SentencesTokens).map((kolp) => {
            if (this.result.Score[kelp][kolp + ""]) {
              if (this.result.Score[kelp][kolp + ""][0] >= 0) {
                total2++;
              }
            }
          });
        });
        this.numero_total = total2;
        this.result.Score;
      }

      let c = [];
      let a = {};
      let b = {};
      const d = [];

      let c2 = [];
      let a2 = {};
      let b2 = {};
      const d2 = [];

      // tslint:disable-next-line: forin
      for (const i in Object.keys(this.result.Score)) {
        if (this.byDocOrSentece) {
          let value_to_be_replaced = Object.keys(this.result.Score)[i];
          let value_to_replace_for = this.result.TempExpressions.filter((a) => {
            return a[0].toLowerCase() == Object.keys(this.result.Score)[i];
          })[0][1];
          value_to_replace_for =
            "<strong><d>" + value_to_replace_for + "</d></strong>";
          let sentence_to_write = this.result.SentencesNormalized.map((a) => {
            if (
              a
                .toLowerCase()
                .toString()
                .search(Object.keys(this.result.Score)[i].toLowerCase()) != -1
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
          });

          sentence_to_write = sentence_to_write.join("__,");
          this.result.TempExpressions.map((a) => {
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
          let f1 = this.result.Score[Object.keys(this.result.Score)[i].toLowerCase()];
          a =
            '<p class="noticem5">Score: ' +
            f1[Object.keys(this.result.Score[Object.keys(this.result.Score)[i].toLowerCase()])[0]][0] +
            "</p><p>" +
            sentence_to_write +
            "</p>";
          if (f1[Object.keys(this.result.Score[Object.keys(this.result.Score)[i].toLowerCase()])[0]][0] > 0.5) {
            a =
              '<p class="noticem4">Score: ' +
              f1[Object.keys(this.result.Score[Object.keys(this.result.Score)[i].toLowerCase()])[0]][0] +
              "</p><p>" +
              sentence_to_write +
              "</p>";

            a2 =
              '<p class="noticem4">Score: ' +
              f1[Object.keys(this.result.Score[Object.keys(this.result.Score)[i].toLowerCase()])[0]][0] +
              "</p><p>" +
              sentence_to_write +
              "</p>";
          } else {
            a2 = null;
          }
        }
        else {
          let valorDeA = "";
          let valorDeA2 = "";
          // tslint:disable-next-line: forin
          for (const xd in this.result.Score[Object.keys(this.result.Score)[i]]) {
            // if()
            d.push({
              x: Object.keys(this.result.Score)[i],
              y: this.result.Score[Object.keys(this.result.Score)[i]][xd][0],
              series: xd,
            });

            let sentence_to_write = this.result.SentencesNormalized[xd.toString()]
              .split('"')
              .join("''");
            let data_chave = Object.keys(this.result.Score)[i];

            let data_chave_replaced_by =
              "<strong>" + this.result.Score[data_chave][xd][1][0] + "</strong>";
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
            // tslint:disable-next-line: whitespace
            // tslint:disable-next-line: max-line-length
            if (this.result.Score[Object.keys(this.result.Score)[i]][xd][0] > 0.5) {
              // tslint:disable-next-line: whitespace
              // tslint:disable-next-line: max-line-length
              valorDeA +=
                '<p class="noticem4">Score: ' +
                this.result.Score[Object.keys(this.result.Score)[i]][xd][0] +
                "</p><p>" +
                sentence_to_write +
                "</p>";

              valorDeA2 +=
                '<p class="noticem4">Score: ' +
                this.result.Score[Object.keys(this.result.Score)[i]][xd][0] +
                "</p><p>" +
                sentence_to_write +
                "</p>";

              d2.push({
                x: Object.keys(this.result.Score)[i],
                y: this.result.Score[Object.keys(this.result.Score)[i]][xd][0],
                series: xd,
              });
            }
            else {
              valorDeA +=
                '<p class="noticem5">Score: ' +
                this.result.Score[Object.keys(this.result.Score)[i]][xd][0] +
                "</p><p>" +
                sentence_to_write +
                "</p>";
            }
          }
          a = valorDeA;
          a2 = valorDeA2;
        }
        b = Object.keys(this.result.Score)[i];
        b2 = Object.keys(this.result.Score)[i];

        c2.push({ x: b2, y: a2, z: d2 });
        c.push({ x: b, y: a, z: d });

        /^\d+$/.test(
          Object.keys(this.result.Score)[i].substring(0, 10).split("-").join("")
        )
          ? ""
          : c.pop();
        /^\d+$/.test(
          Object.keys(this.result.Score)[i].substring(0, 10).split("-").join("")
        )
          ? ""
          : c2.pop();
        c2 = c2.filter((y) => {
          if (y.y) {
            return true;
          } else {
            return false;
          }
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
        return a.dateparsed2 - b.dateparsed2;
      });
      c2 = c2.sort((a, b) => {
        return a.dateparsed2 - b.dateparsed2;
      });
      c = c.sort((a, b) => {
        return a.dateparsed - b.dateparsed;
      });
      c2 = c2.sort((a, b) => {
        return a.dateparsed - b.dateparsed;
      });

      this.dataset = c;
      this.datasetFixed = this.dataset;
      for (let hu = 0; hu < this.datasetFixed.length; hu++) {
        this.result.TempExpressions.map((a) => {
          if (this.datasetFixed[hu].y.search(a[0]) != -1) {
            this.datasetFixed[hu].y = this.datasetFixed[hu].y.replace(
              "<d>" + a[0] + "</d>",
              "<d>" + a[1] + "</d>"
            );
          }
          if (this.datasetFixed[hu].y.search(a[0].toUpperCase()) != -1) {
            this.datasetFixed[hu].y = this.datasetFixed[hu].y.replace(
              "<d>" + a[0].toUpperCase() + "</d>",
              "<d>" + a[1] + "</d>"
            );
          }
        });
      }
      this.datasetRelOnly = c2;
      this.datasetFixed2 = this.datasetRelOnly;
      for (let hu = 0; hu < this.datasetFixed2.length; hu++) {
        this.result.TempExpressions.map((a) => {
          if (this.datasetFixed2[hu].y.search(a[0]) != -1) {
            this.datasetFixed2[hu].y = this.datasetFixed2[hu].y.replace(
              "<d>" + a[0] + "</d>",
              "<d>" + a[1] + "</d>"
            );
          }
          if (this.datasetFixed[hu].y.search(a[0].toUpperCase()) != -1) {
            this.datasetFixed2[hu].y = this.datasetFixed2[hu].y.replace(
              "<d>" + a[0].toUpperCase() + "</d>",
              "<d>" + a[1] + "</d>"
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
    }
    console.log(this.datasetFixed)
    console.log(this.datasetFixed.length)
    console.log(this.datasetFixed2)
    for (let i = 0; i < this.datasetFixed.length; i++) {
      console.log(this.datasetFixed[i].y)
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
      let data = {
        "date": this.datasetFixed2[i].x,
        "text": score[1] + "<\/p>",
        "score": score[0] + "<\/p>",
      }
      this.df2.push(data)
    }
  }

  public getKeyword(event: any) {
    event.preventDefault();
    if (this.conteudoDefault.length == 0) {
      this._snackBar.open("Sem texto", "", {
        duration: 2000,
      });
      return;
    }

    this.loading = true;

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

    this.optio = {
      docCreatTime: this.documentCreationTime,
      dateGranularity: this.dateGranularitySelected,
      docOrSentence: this.byDocOrSentece ? "doc" : "sentence",
      algo: this.algoritmoSelected,
      ngram: this.ngramSelected,
      language: this.languagueSelected,
      numberOfKeywords: this.numberOfKeyWords,
      nContextualWindow: j,
      documentType: this.documentTypeSelected,
      dateBegin: this.dateBegin,
      dateEnd: this.dateEnd,
      n: k,
      tH: this.TH,
    };

    this.timeline
      .getTextKeyDateFromSingleDoc(this.conteudoDefault, this.optio)
      .subscribe((res) => {
        if (res) {
          console.log(res)
          if (res.message == "success") {
            this.result = res;
            this.wikifier
              .getWikifier(this.conteudoDefault)
              .pipe(
                timeout(10000),
                catchError(err => {
                  console.log('Wikifier Error: ', err);
                  this.errorWikifier = true;
                  this.requestMade = true;
                  this.loading = false;
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
                  this.errorWikifier = true;
                }
                this.update();
                this.requestMade = true;
                this.loading = false;
                return " ";
              });
          }
          else {
            this.oops = true;
            return ""
          }
        }
        else {
          return " ";
        }
      });
  }

  changeNarrToggle() {
    let x = (<HTMLInputElement>document.getElementById('narrTextToggle'))
    if (x.innerHTML === ' Narrativa') {
      x.innerHTML = ' Texto Livre'
      //console.log('Texto Livre')
      this.router.navigate(['']).then(r => '')
    }
    else {
      x.innerHTML = ' Narrativa'
      //console.log('Query / URL')
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
}

