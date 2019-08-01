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
    others: any,
    signature_count: any,
    abstained: any) {}
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

      this.constitData = cd[id]; 
    
    }else if(datatype == "petition" && dataset == "brexit"){

      let mp_data = Election2017["default"][id];
      let code_ons = mp_data["code_ons"];  
      let signatures_by_constituency = PetitionBrexit["default"]["data"]["attributes"]["signatures_by_constituency"];
      
      let filtered_signatures = signatures_by_constituency.filter(function (el) {
        return el.ons_code == code_ons;
      }); 

      let abstainees = mp_data["electorate_size"]-filtered_signatures[0]["signature_count"];

      let petition_win = "petition";

      if(abstainees > filtered_signatures[0]["signature_count"]){
        petition_win = "abstainees";
      }

      this.constitData = {
        code_ons: mp_data["code_ons"],
        constit: mp_data["constit"],
        electorate_size: mp_data["electorate_size"],
        mp_img: mp_data["mp_img"],
        mp_name: mp_data["mp_name"],
        others: mp_data["others"],
        region: mp_data["region"],
        signature_count: filtered_signatures[0]["signature_count"],
        abstained: abstainees,
        win: petition_win
      };   

    } 

    return of(this.constitData);
  } 
}
