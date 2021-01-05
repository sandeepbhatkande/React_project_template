import React from 'react';
import QueryDataView from 'js/modules/querydata/components/QueryDataView';
import renderer from 'react-test-renderer';

describe('QueryDataView', () => {
    describe('render', () => {
      it('QueryData component render', () => {
        
        const component = renderer.create(
          <QueryDataView />
        );
    
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });