import React from 'react';
import { shallow } from 'enzyme';

import { Footer } from '../src/components/Footer';

const wrapper = shallow(<Footer />);

describe('<Footer />', () => {
	test('Has correct DOM type', () => expect(wrapper.type()).toBe('footer'));
});
