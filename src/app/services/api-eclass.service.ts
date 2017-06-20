import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiEclassService {
  BASE_URL = 'http://localhost:3000';

  constructor(public http: Http) { }

  getChildren(eClass) {
    return this.http.get(`${this.BASE_URL}/apieclass/${eClass}`).map(res=>res.json());
  }
}
