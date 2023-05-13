import renderer from 'react-test-renderer';
import React from 'react';
import PinInput from '../../../components/PinInput/index';

const props = {
    title: 'Default title',
    url: '/PinInput/to/test'
};

describe('Components > PinInput', () => {
    it('Render a snapshot for PinInput use renderer', () => {
        const tree = renderer.create(<PinInput {...props} />).toJSON();
        expect(tree).toMatchSnapshot();
    })
})