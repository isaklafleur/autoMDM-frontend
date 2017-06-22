import { Component, OnInit, ViewChild } from "@angular/core";

import {
  TreeNode,
  TREE_ACTIONS,
  KEYS,
  IActionMapping
} from "angular-tree-component";
import { ApiEclassService } from "../../services/api-eclass.service";

const actionMapping: IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);
    },
    dblClick: (tree, node, $event) => {
      //if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      console.log(node);
    },
    click: (tree, node, $event) => {
      $event.shiftKey
        ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event)
        : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
    }
  },
  keys: {
    // [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
  }
};

@Component({
  selector: "app-tree",
  templateUrl: "./tree.component.html",
  styleUrls: ["./tree.component.css"]
})
export class TreeComponent implements OnInit {
  nodes = [];
  treeOptions = {
    getChildren: this.getChildren.bind(this),
    idField: "_id",
    actionMapping
  };
  filterId;
  @ViewChild('tree') tree: any;
  
  constructor(public apiEclassService: ApiEclassService) {
    this.apiEclassService.loadFilter$.subscribe(filterId => this.loadFilter(filterId));
  }

  ngOnInit() {
    this.apiEclassService.getChildren("-1").subscribe(res => {
      this.nodes = this.prepareNodes(res.nodes);
    });
  }

  loadFilter(filterId) {
    this.filterId = filterId;
    this.nodes=[];
    
    this.apiEclassService.getChildren("-1", this.filterId).subscribe(res => {
      this.nodes = this.prepareNodes(res.nodes);
      setTimeout(()=>this.tree.treeModel.filterNodes(node=>node.collapse()), 0);
    });
    
    
  }

  getChildren(node: TreeNode) {
    return new Promise((resolve, reject) => {
      this.apiEclassService.getChildren(node.data.codedName, this.filterId).subscribe(res => {
        resolve(this.prepareNodes(res.nodes));
        setTimeout(
          () => this.updateChildNodesCheckBox(node, node.data.checked),
          0
        );
      });
    });
  }

  saveFilter(name, tree) {
    let filterNodes = [];
    tree.treeModel.filterNodes(node => {
      if(node.data.checked) {
        if(node.hasChildren && !node.children) {
          let segmentFilter = node.data.codedName.match(/.{1,2}/g).filter(s => s !== "00").join("");
          filterNodes.push(segmentFilter);
        } else {
          filterNodes.push(node.data.codedName);
        }
      }
      return true;
    });
    this.apiEclassService.saveTreeFilter({name, nodes:filterNodes}).subscribe(res=>{

    })
    console.log(filterNodes)
  }

  prepareNodes(nodes) {
    let ret = nodes.map(node => {
      node.name =
        node.codedName.match(/.{1,2}/g).filter(s => s !== "00").join("-") +
        " " +
        node.preferredName;
      if (node.keyword) {
        node.name += " KW: " + node.keyword;
      }
      if (node.eclassCommodityClass === "00") {
        node.hasChildren = true;
      }
      return node;
    });
    return ret;
  }

  selectNode() {

  }

  check(node, $event) {
    this.updateChildNodesCheckBox(node, $event.target.checked);
    this.updateParentNodesCheckBox(node.parent);
  }

  updateChildNodesCheckBox(node, checked) {
    node.data.checked = checked;
    if (node.children) {
      node.children.forEach(child =>
        this.updateChildNodesCheckBox(child, checked)
      );
    }
  }

  updateParentNodesCheckBox(node) {
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
