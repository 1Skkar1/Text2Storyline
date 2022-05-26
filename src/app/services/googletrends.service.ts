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

export class GoogleTrendsService {
  url: string;

  constructor(private http: HttpClient) {
    // FULL URL: https://tm-websuiteapps.ipt.pt/googletrends/api/v1.0
    this.url = "/googletrends/api/v1.0/";
  }

  public getTrending(pn: string, topn: number): Observable<any> {
    let realURL = this.url + "trending?pn=" + pn + "&topn=" + topn

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

  public getTop(geo: string, topn: number): Observable<any> {
    let realURL = this.url + "top?geo=" + geo + "&topn=" + topn

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

  public getRelated(query: string, topn: number): Observable<any> {
    let realURL = this.url + "related?query=" + query + "&topn=" + topn

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

  public getInterestRegion(query: string, topn: number): Observable<any> {
    let realURL = this.url + "interest_region?query=" + query + "&topn=" + topn

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
