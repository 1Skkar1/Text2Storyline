import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";

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
    // FULL URL: https://www.wikifier.org/annotate-article
    this.urlWikify = "/wikifier";
    // FULL URL: https://pt.wikipedia.org/w/api.php - Change "pt" for any other language
    this.urlMediaWiki = "/wikipedia";
    this.user_key = "fuoblmokuuofjdffiyvbkqlojxnjtf";
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

  public getWikiText(title, lang): Observable<any> {
    let url = this.urlMediaWiki + "PT"
    if (lang == "English") {
      url = this.urlMediaWiki + "EN"
    }
    else if (lang == "French") {
      url = this.urlMediaWiki + "FR"
    }
    else if (lang == "German") {
      url = this.urlMediaWiki + "DE"
    }
    else if (lang == "Italian") {
      url = this.urlMediaWiki + "IT"
    }
    else if (lang == "Dutch") {
      url = this.urlMediaWiki + "NL"
    }
    else if (lang == "Spanish") {
      url = this.urlMediaWiki + "ES"
    }

    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded;'
    );
    //let params = "?format=json&action=query&prop=extracts&exintro=true&explaintext=1&titles=" + title
    let params = "?format=json&action=query&prop=extracts&explaintext=1&titles=" + title
    url = url + params

    return this.http.post(url, {headers: headers}).pipe(
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

  public getWikiImage(title, lang): Observable<any> {
    let url = this.urlMediaWiki + "PT"
    if (lang == "English") {
      url = this.urlMediaWiki + "EN"
    }
    else if (lang == "French") {
      url = this.urlMediaWiki + "FR"
    }
    else if (lang == "German") {
      url = this.urlMediaWiki + "DE"
    }
    else if (lang == "Italian") {
      url = this.urlMediaWiki + "IT"
    }
    else if (lang == "Dutch") {
      url = this.urlMediaWiki + "NL"
    }
    else if (lang == "Spanish") {
      url = this.urlMediaWiki + "ES"
    }

    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded;'
    );
    let params = "?format=json&action=query&prop=pageimages&format=json&pithumbsize=400&titles=" + title
    url = url + params

    return this.http.post(url, {headers: headers}).pipe(
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
