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

  public getWordCloud(keywords: string, lang: string): Observable<any> {
    let jsoon;
    if (lang ==  "English") {
      jsoon = '{ "keywords":' + JSON.stringify(keywords) + ', "language": "english" }'
    }
    else if (lang ==  "French") {
      jsoon = '{ "keywords":' + JSON.stringify(keywords) + ', "language": "french" }'
    }
    else if (lang ==  "German") {
      jsoon = '{ "keywords":' + JSON.stringify(keywords) + ', "language": "german" }'
    }
    else if (lang ==  "Italian") {
      jsoon = '{ "keywords":' + JSON.stringify(keywords) + ', "language": "italian" }'
    }
    else if (lang ==  "Dutch") {
      jsoon = '{ "keywords":' + JSON.stringify(keywords) + ', "language": "dutch" }'
    }
    else if (lang ==  "Spanish") {
      jsoon = '{ "keywords":' + JSON.stringify(keywords) + ', "language": "spanish" }'
    }
    else {
      jsoon = '{ "keywords":' + JSON.stringify(keywords) + ', "language": "portuguese" }'
    }

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
