import * as React from "react";

interface IChildrenProps {
  api: {
    toggleNode: Tree["toggleNode"];
    getTree: () => ITreeState["tree"];
  };
}

export type IConfigItem<T = {}> = T & {
  id: string;
  title: string;
  children?: IConfigItem[];
};

type TreeType = INode[];

interface INode extends IConfigItem {
  active: boolean;
  children: TreeType;
}

interface ITreeProps {
  config: IConfigItem[];
  activeId?: string;
  children: (childrenProps: IChildrenProps) => React.ReactNode;
}

interface ITreeState {
  tree: TreeType;
}

interface ITreeMap {
  [key: string]: any;
}

export class Tree extends React.Component<ITreeProps, ITreeState> {
  public state: ITreeState = {
    tree: []
  };
  private treeMap: ITreeMap = {};

  public toggleNode = (event: React.SyntheticEvent<HTMLElement>): void => {
    event.stopPropagation();

    this.extendOnToggle(event.currentTarget.id);
  };

  public componentDidMount() {
    this.initializeTree(this.props.activeId);
  }

  public render() {
    return this.props.children({
      api: {
        toggleNode: this.toggleNode,
        getTree: () => this.state.tree
      }
    });
  }

  private createTreeExtender = (
    customExtenderFn: (node: any) => Partial<INode>
  ) => {
    return function extender(data: IConfigItem[]): TreeType {
      return data.reduce((result: any, node: any) => {
        return [
          ...result,
          {
            ...node,
            ...customExtenderFn(node),
            children: node.children ? extender(node.children) : null
          }
        ];
      }, []);
    };
  };

  private setTreeState = (treeState: TreeType) => {
    this.setState({
      tree: treeState
    });
  };

  private initializeTree = (activeId?: INode["id"]): void => {
    this.treeMap = this.createTreeMap(this.props.config);

    const initialTreeState = this.createTreeExtender((node: IConfigItem) => ({
      active:
        activeId && this.treeMap[activeId].includes(node.id) ? true : false
    }))(this.props.config);

    this.setTreeState(initialTreeState);
  };

  private extendOnToggle = (nodeId: string): void => {
    const toggledTreeState = this.createTreeExtender((node: INode) => ({
      active: nodeId === node.id ? !node.active : node.active
    }))(this.state.tree);

    this.setTreeState(toggledTreeState);
  };

  private createTreeMap = (
    data: IConfigItem[],
    parentNodePath?: string
  ): ITreeMap => {
    return data.reduce((resultTreeMap: ITreeMap, node: IConfigItem) => {
      const nodePath = parentNodePath
        ? `${parentNodePath}:${node.id}`
        : node.id;

      resultTreeMap[node.id] = nodePath;

      if (node.children) {
        resultTreeMap = {
          ...resultTreeMap,
          ...this.createTreeMap(node.children, nodePath)
        };
      }

      return resultTreeMap;
    }, {});
  };
}
