import * as React from 'react';

import { Tree } from './Tree'

import { render, fireEvent } from 'react-testing-library';


describe('Tree', () => {
  it('renders properly', () => {
    const treeEl = ( 
      <Tree activeId='/some-id-2' config={
        [
          { 
            id: '/some-id',
            title: 'some title',
            children: [
              { 
                id: '/some-new',
                title: 'cool title',
                children: [
                  { 
                    id: '/some-id-1',
                    title: 'coolio title',
                    children: [
                      { 
                        id: '/some-id-2',
                        title: 'some title',
                        children: [
                          { 
                            id: '/some-id-10',
                            title: 'some title',
                          },
                          { 
                            id: '/some-id-20',
                            title: 'some title',
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ], 
          }, 
          {
            id: '/one-more-id',
            title: 'some title',
            children: [
              { 
                id: '/and-more-some-id',
                title: 'some title',
                children: [
                  { 
                    id: '/one-more-more-id',
                    title: 'some title',
                  }
                ]
              }
            ], 
          }
        ]
      }>
        {
          ({ api: { toggleState, getTree } }) => {
            const renderTree = (tree: any) => tree.map((node: any) => {
              return (
                <li data-path={node.path} data-active={node.active} key={node.id} id={node.id} onClick={toggleState}>
                  {node.title}
                  {node.children ? <ul>{renderTree(node.children)}</ul> : null}
                </li>
              );
            })

            return <ul>{renderTree(getTree())}</ul>;
          } 
        }
      </Tree>
    );

    const { container, getByText } = render(treeEl);

    expect(container.firstChild).toMatchSnapshot();

    fireEvent.click(getByText('coolio title'))

    expect(container.firstChild).toMatchSnapshot();
  })
});
