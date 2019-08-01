import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators'; 
import { of } from 'rxjs';

import * as Election2017 from '../assets/json/mp_details_full.json'; 
import * as Election0 from '../assets/json/election-data.json'; 
import * as ConstitONS from '../assets/json/constit_ons.json'; 
import * as PetitionBrexit from '../assets/json/petitions-241584.json'; 

export class ConstitDataFields {
  constructor(
    code_ons: any,
    constit: any,
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
  }

  getConstitData(id, datatype, dataset): Observable<ConstitDataFields[]> {

    let cd = [];

    if(datatype == "election" && dataset == "2017"){

      cd = Election2017["default"];    
    
    }else if(datatype == "petition" && dataset == "brexit"){
    
      cd = PetitionBrexit["default"];  
    
    } 

    this.constitData = cd[id]; 

    return of(this.constitData);
  } 
}
