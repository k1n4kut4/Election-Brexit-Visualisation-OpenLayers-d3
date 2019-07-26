import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3map',
  templateUrl: './d3map.component.html',
  styleUrls: ['./d3map.component.scss']
})
export class D3mapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    // Select <p> element using d3 and change style..
      d3.select('p').style('color', 'red');
  }

  radius: number=15;
  clickeventcount: number =0 ;
  svgclickhandle(event: any ) {
    this.clickeventcount+=1;
    let colorname = 'black';
  if (this.clickeventcount % 5 === 0)  {
      colorname ='red';
  } else if (this.clickeventcount % 3 === 0) {
    colorname ='yellow';
  } else if (this.clickeventcount % 2 === 0) {
    colorname ='purple';
  }
  d3.select(event.target).
    append('circle').
    attr('cx', event.x).
    attr('cy',event.y).
    attr('r',this.radius).
    attr('fill',colorname);
  }

}
