import * as React from 'react';

interface ITree {
  config: any;
  activeId?: string;
  children: ({ api }: { api: any }) => React.ReactNode;
}


export class Tree extends React.Component<ITree> {
  treeMap: any = {}

  state = {
    tree: [], 
  }  

  initializeTree = (activeId: any) => {
    this.treeMap = this.createTreeMap(this.props.config);

    this.setState({
      tree: this.createTreeConfigExtender((node: any) => {
        return {
          active: activeId && this.treeMap[activeId].includes(node.id) ? true : false, 
        }
      })(this.props.config),
    })
  }

  createTreeConfigExtender = (predicateFn: any) => {
    return function extender (data: any) {
      return data.reduce((result: any, node: any) => {
        return [
          ...result, 
          { 
            ...node,
            ...predicateFn(node),
            children: node.children ? extender(node.children) : null,
          }
        ];
      }, []);
    }
  }

  extendOnToggle = (nodeId: any) => {
    this.setState({
      tree: this.createTreeConfigExtender((node: any) => {
        return {
          active: nodeId === node.id ? !node.active : node.active, 
        }
      })(this.state.tree)
    });
  }

  createTreeMap = (data: any, parentNodePath?: string) => {
    return data.reduce((resultTreeMap: any, node: any) => {
      const nodePath = parentNodePath ? `${parentNodePath}:${node.id}` : node.id;

      resultTreeMap[node.id] = nodePath;  

      if (node.children) {
        resultTreeMap = {
          ...resultTreeMap,
          ...this.createTreeMap(node.children, nodePath),
        }
      }

      return resultTreeMap;
    }, {});
  }

  toggleState = (event: any) => {
    event.stopPropagation();

    this.extendOnToggle(event.currentTarget.id);
  }

  componentDidMount() {
    this.initializeTree(this.props.activeId);
  }

  render() {
    return this.props.children({
      api: { 
        toggleState: this.toggleState, 
        getTree: () => this.state.tree,
      },
    });
  }
};
