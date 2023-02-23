import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})

export class ArquivoService {
  urlQueryCorpus: string;
  urlQueryDoc: string;
  url: string;
  url2: string;
  urlImg: string;
  urlImg2: string;

  constructor(private http: HttpClient) {
    this.urlQueryCorpus = "https://tm-websuiteapps.ipt.pt/timematters/QueryArquivoPT/RuleBased/api/v1.0/ScoreByCorpus";
    this.urlQueryDoc = "https://tm-websuiteapps.ipt.pt/timematters/QueryArquivoPT/RuleBased/api/v1.0/ScoreByDoc";
    this.url = "https://tm-websuiteapps.ipt.pt/arquivo/api/v1.0/textsearch_query";
    this.urlImg = "https://arquivo.pt/imagesearch";
  }

  public getQuery(query: string, options: any): Observable<any> {
    const formData = new FormData();
    formData.append("query", query.toLowerCase())
    formData.append("max_items", options.maxItems)
    formData.append("domains", JSON.stringify(options.domains))
    formData.append("last_years", options.lastYears)
    formData.append("title", options.title)
    formData.append("snippet", options.snippet)
    formData.append("fullContent", options.fullContent)
    formData.append("newspaper3k", options.newspaper3k)

    return this.http.post(this.urlQueryDoc, formData).pipe(
      map((res, err) => {
        if (res) {
          //console.log("Good!");
          //console.log(res);
          return res;
        } else {
          //console.log("Bad!");
          //console.log(res);
          //console.log(err);
          return err;
        }
      })
    );
  }

  public getDocs(search: string, options: any): Observable<any> {
    const formData = new FormData();
    formData.append("query", search)
    formData.append("max_items", options.maxItems)
    formData.append("domains", JSON.stringify(options.domains))
    formData.append("last_years", "10")
    //formData.append("date_start", "2009")
    //formData.append("date_end", "2022")
    formData.append("title", "False")
    formData.append("snippet", "True")
    formData.append("fullContent", "False")
    formData.append("newspaper3k", "False")

    return this.http.post(this.url, formData).pipe(
      map((res, err) => {
        if (res) {
          //console.log("Good!");
          //console.log(res);
          return res;
        } else {
          //console.log("Bad!");
          //console.log(res);
          //console.log(err);
          return err;
        }
      })
    );
  }

  public getImgURL(search: string): Observable<any> {
    let realURL = this.urlImg + "?q=" + search + "&size=md";
    return this.http.get(realURL).pipe(
      map((res, err) => {
        if (res) {
          //console.log(res);
          return res;
        } else {
          //console.log(err);
          return err;
        }
      })
    );
  }
}
