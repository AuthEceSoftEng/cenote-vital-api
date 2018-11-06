import React from 'react';

import { ChangeUsername, ChangePassword } from '../../components';


export default function Account() {
	return (
		<div className="account-settings">
			<ChangeUsername />
			<ChangePassword />
		</div>
	);
}
