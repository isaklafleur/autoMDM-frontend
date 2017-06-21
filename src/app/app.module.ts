import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TreeModule } from 'angular-tree-component';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { ApiEclassService } from './services/api-eclass.service';
import { TreeComponent } from './components/tree/tree.component';
import { FilterListComponent } from './components/filter-list/filter-list.component'

@NgModule({
  declarations: [
    AppComponent,
    TreeComponent,
    FilterListComponent
  ],
  imports: [
    BrowserModule,
    TreeModule,
    HttpModule
  ],
  providers: [ApiEclassService],
  bootstrap: [AppComponent]
})
export class AppModule { }
