import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";


export interface ReceivedData {
  res: any;
  error: any;
}

@Injectable({
  providedIn: "root",
})

export class WikifierService {
  urlDBPedia: string;
  urlWikify: string;
  urlMediaWiki: string;
  user_key: string;

  constructor(private http: HttpClient) {
    // FULL URL: https://api.dbpedia-spotlight.org/pt/annotate
    this.urlDBPedia = "https://api.dbpedia-spotlight.org/pt/annotate";
    // FULL URL: https://www.wikifier.org/annotate-article
    this.urlWikify = "/wikifier";
    // FULL URL: https://pt.wikipedia.org/w/api.php
    this.urlMediaWiki = "/wikipedia";
    this.user_key = "fuoblmokuuofjdffiyvbkqlojxnjtf";
  }

  public getDBPedia(text: string): Observable<any> {
    const headers = new HttpHeaders().set(
      'accept',
      'text/html'
    );
    const realURL = this.urlDBPedia + "?text=" + text + "&confidence=0.5"

    // @ts-ignore
    return this.http.get(realURL, {headers: headers}, {responseType: "text"}).pipe(
      catchError((err => {
        let index1 = err.error.text.indexOf('<div>') + 5
        let index2 = err.error.text.indexOf('</div>')
        let dbpedia = err.error.text.substring(index1, index2)
        return dbpedia;
      }))
    );
  }

  public getWikifier(text: string): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded;'
    );
    let body = 'userKey=' + this.user_key + '&text=' + text + "&lang=auto" + "&ranges=false"

    return this.http.post(this.urlWikify, body, {headers: headers}).pipe(
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

  public getWikiText(title): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded;'
    );
    let params = "?format=json&action=query&prop=extracts&exintro=1&explaintext=1&titles=" + title
    let realURL = this.urlMediaWiki + params

    return this.http.post(realURL, {headers: headers}).pipe(
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

  public getWikiImage(title): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded;'
    );
    let params = "?format=json&action=query&prop=pageimages&format=json&pithumbsize=400&titles=" + title
    let realURL = this.urlMediaWiki + params

    return this.http.post(realURL, {headers: headers}).pipe(
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
