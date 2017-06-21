import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiEclassService {
  BASE_URL = 'http://localhost:3000';

  public loadFilter$: EventEmitter<any>;
  
  constructor(public http: Http) {
    this.loadFilter$ = new EventEmitter();
  }

  getChildren(eClass, filterId?) {
    let filter = filterId ? `?filterId=${filterId}` : '';
    return this.http.get(`${this.BASE_URL}/apieclass/${eClass}${filter}`).map(res=>res.json());
  }

  saveTreeFilter(filter) {
    return this.http.post(`${this.BASE_URL}/apieclass`, filter).map(res=>res.json());
  }

  getFilters() {
    return this.http.get(`${this.BASE_URL}/apieclass/filter`).map(res=>res.json());
  }
}
