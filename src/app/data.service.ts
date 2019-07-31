import { Injectable } from '@angular/core';

import * as ConstitData from '../assets/json/mp_details_full.json'; 

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getConstitData(id){

    console.log(id);

    const cd = ConstitData.default;  

    console.log(cd[id]);

    return cd[id];

  }
}
