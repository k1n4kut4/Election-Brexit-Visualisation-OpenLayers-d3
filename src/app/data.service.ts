import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; 
import { map, catchError } from 'rxjs/operators'; 
import { of } from 'rxjs';

import * as ConstitData from '../assets/json/mp_details_full.json'; 

export class ConstitDataFields {
  constructor(
    code_ons: any,
    constit_name: any,
    region: any,
    mp_img: any,
    mp_name: any,
    electorate_size: any, 
    votes: any,
    status: any,
    win: any,
    swing: any,
    year: any,
    con: any,
    lab: any,
    lib: any,
    grn: any,
    dup: any,
    sf: any,
    snp: any,
    ukip: any,
    uup: any,
    others: any) {}
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constitData: ConstitDataFields[];

  constructor(private http: HttpClient) { }  

  getConstitData(id): Observable<ConstitDataFields[]> {

    const cd = ConstitData;//.default;        
    //this.constitData["constit_name"] = cd[id]["constit"];
    //console.log(this.constitData); 

    this.constitData = cd;
    
    return of(this.constitData);

  }
}
