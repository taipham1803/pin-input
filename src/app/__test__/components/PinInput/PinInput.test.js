import renderer from 'react-test-renderer';
import React from 'react';
import PinInput from '../../../components/PinInput/index';

describe('Components > PinInput', () => {
  it('Render a snapshot for PinInput use renderer', () => {
    const tree = renderer.create(<PinInput length={5} />).toJSON();
    expect(tree).toMatchSnapshot();
  })
})