import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

export interface ReceivedData {
  res: any;
  error: any;
}

@Injectable({
  providedIn: "root",
})

export class TimelineService {
  url: string;

  constructor(private http: HttpClient) {
    this.url = "https://tm-websuiteapps.ipt.pt/timematters";
  }

  public getTextKeyDateFromUrl(urlStr: string, options: any): Observable<any> {
    let goal = ''
    if (options.docCreateTime) {
      goal = ["&document_creation_time=", options.docCreateTime].join("");
    }

    let realURL = [this.url , '/SingleDoc/Heideltime/api/v1.0/ScoreByDoc_by_url?url=',urlStr,goal].join("")

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

  public getTextKeyDateFromSingleDoc(doc: string, options: any): Observable<any> {
    const formData = new FormData();
    let realURL = this.url + "/SingleDoc";
    if (options.algo === "py_heideltime") {
      realURL += "/Heideltime/api/v1.0";
      if (options.docCreateTime) {
        formData.append("document_creation_time", options.docCreateTime);
      }
      if (options.language) {
        formData.append("language", options.language);
      }
    } else {
      realURL += "/RuleBased/api/v1.0";
      if (options.dateBegin) {
        formData.append("begin_date", options.dateBegin);
      }
      if (options.dateEnd) {
        formData.append("end_date", options.dateEnd);
      }
    }
    if (options.score === "doc") {
      realURL += "/ScoreByDoc";
    } else {
      realURL += "/ScoreBySentence";
    }

    formData.append("text", doc);

    if (options.ngram) {
      formData.append("ngram", options.ngram);
    }
    if (options.numberOfKeywords) {
      formData.append("num_of_keywords", options.numberOfKeywords);
    }
    if (options.nContextualWindow) {
      formData.append("n_contextual_window", options.nContextualWindow);
    }
    if (options.n) {
      formData.append("N", options.n);
    }
    if (options.tH) {
      formData.append("TH", options.tH);
      if (options.tH > 1) {
        formData.append("TH", "1");
      }
    }
    if (options.dateGranularity) {
      formData.append("date_granularity", options.dateGranularity);
    }

    return this.http.post(realURL, formData).pipe(
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
