import { Component, OnInit } from '@angular/core';
import { ApiEclassService } from "../../services/api-eclass.service";

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.css']
})
export class FilterListComponent implements OnInit {
  filters: any[];

  constructor(public apiEclassService: ApiEclassService) { }

  ngOnInit() {
    this.apiEclassService.getFilters().subscribe(response=>{
      this.filters = response.filters;
    })
  }

  loadFilter(filterId) {
    this.apiEclassService.loadFilter$.emit(filterId);
  }
  
  loadFullTree() {
    this.apiEclassService.loadFilter$.emit(null);
  }
}
