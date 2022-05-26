import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})

export class YakeService {
  url: string;
  url2: string;
  urlWordCloud: string;

  constructor(private http: HttpClient) {
    this.url = "https://tm-websuiteapps.ipt.pt/yake/api/v2.0/extract_keywords";
    this.url2 = "http://narrarquivo.inesctec.pt/yake/v2/extract_keywords";
    this.urlWordCloud = "/wordCloudCMH/api/v1.0/base64";
  }

  public getKeywords(search: string, max_ngram, numberKW): Observable<any> {
    const formData = new FormData();
    formData.append("content", search)
    formData.append("max_ngram_size", max_ngram)
    formData.append("number_of_keywords", numberKW)

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

  public getWordCloud(keywords: string): Observable<any> {
    const jsoon = '{ "keywords":' + JSON.stringify(keywords) + ', "language": "portuguese" }'
    const realURL = this.urlWordCloud + "?json=" + jsoon + "&width=1000&height=500"

    return this.http.get(realURL).pipe(
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
}
