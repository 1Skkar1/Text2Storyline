import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})

export class LangDetectService {
  url: string;
  constructor(private http: HttpClient) {
    //this.url = 'https://langdec-api-heroku.herokuapp.com/langdetect/';
    this.url = "/languageDetection/api/v1.0";
  }

  public getLanguage(search: string): Observable<any> {
    const formData = new FormData();
    formData.append("content", search);

    return this.http.post(this.url, formData).pipe(
      map((res, err) => {
        if (res) {
          //console.log(res);
          return res;
        }
        else {
          //console.log(err);
          return err;
        }
      })
    );
  }
}
