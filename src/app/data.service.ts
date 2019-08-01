import { Injectable } from '@angular/core';
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

  constitData: ConstitDataFields[] = [];

  constructor() { }  

  ngOnInit(){ 
    //this.constitData = [];
  }

  getConstitData(id): Observable<ConstitDataFields[]> {

    const cd = ConstitData["default"];   
    this.constitData = cd[id]; 

    return of(this.constitData);
  } 
}
