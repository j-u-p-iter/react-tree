import * as React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";

import { Tree } from "../.";
import { treeConfig } from "../tree-config";

describe("Tree", () => {
  let getTreeEl: any;

  beforeAll(() => {
    getTreeEl = (props: any = {}) => (
      <Tree config={treeConfig} {...props}>
        {({ api: { toggleNode, getTree } }) => {
          const renderTree = (tree: any) =>
            tree.map((node: any) => {
              return (
                <li
                  key={node.id}
                  id={node.id}
                  data-active={node.active}
                  onClick={toggleNode}
                >
                  {node.title}
                  {node.children ? <ul>{renderTree(node.children)}</ul> : null}
                </li>
              );
            });

          return <ul>{renderTree(getTree())}</ul>;
        }}
      </Tree>
    );
  });

  afterEach(cleanup);

  it("renders correctly by default", () => {
    const { container } = render(getTreeEl());

    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with activeId", () => {
    const { container } = render(getTreeEl({ activeId: "2" }));

    expect(container.firstChild).toMatchSnapshot();
  });

  it("toggles nodes correctly", () => {
    const { container, getByText } = render(getTreeEl({ activeId: "2" }));

    expect(container.firstChild).toMatchSnapshot();

    // opens node with "Title 3"
    fireEvent.click(getByText("Title 3"));
    expect(container.firstChild).toMatchSnapshot();

    // closes node with "Title 2"
    fireEvent.click(getByText("Title 2"));
    expect(container.firstChild).toMatchSnapshot();
  });
});
