import { Component, OnInit } from '@angular/core';

import { TreeNode } from 'angular-tree-component';
import { ApiEclassService } from '../../services/api-eclass.service';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  nodes = [];
  treeOptions = {
    getChildren: this.getChildren.bind(this),
    idField: "_id"
  }

  constructor(public apiEclassService: ApiEclassService) { }

  ngOnInit() {
    this.apiEclassService.getChildren("-1").subscribe(res=>{
      this.nodes = this.prepareNodes(res.nodes);
    })
  }

  getChildren(node:TreeNode) {
    return new Promise((resolve, reject) => {
      this.apiEclassService.getChildren(node.data.eclass).subscribe(res=>{
        resolve( this.prepareNodes(res.nodes) );
        setTimeout(()=>this.updateChildNodesCheckBox(node, node.data.checked), 0);
      })
    });
  }

  prepareNodes(nodes) {
    let ret =  nodes.map(node=>{     
      node.eclass = node.eclassSegment + node.eclassMainGroup + node.eclassGroup + node.eclassCommodityClass;
      node.name = node.eclass.match(/.{1,2}/g).filter(s=>s!=="00").join('-') + " " + node.preferredName;
      if(node.eclassCommodityClass=="00") {
        node.hasChildren = true;
      }
      return node;
    })
    return ret;
  }

public check(node, $event) {
  this.updateChildNodesCheckBox(node, $event.target.checked);
  this.updateParentNodesCheckBox(node.parent);
}
public updateChildNodesCheckBox(node, checked) {
  node.data.checked = checked;
  if (node.children) {
    node.children.forEach((child) => this.updateChildNodesCheckBox(child, checked));
  }
}
public updateParentNodesCheckBox(node) {
  if (node && node.level > 0 && node.children) {
    let allChildChecked = true;
    let noChildChecked = true;

    for (let child of node.children) {
      if (!child.data.checked) {
        allChildChecked = false;
      } else if (child.data.checked) {
        noChildChecked = false;
      }
    }

    if (allChildChecked) {
      node.data.checked = true;
      node.data.indeterminate = false;
    } else if (noChildChecked) {
      node.data.checked = false;
      node.data.indeterminate = false;
    } else {
      node.data.checked = true;
      node.data.indeterminate = true;
    }
    this.updateParentNodesCheckBox(node.parent);
  }
}


}
