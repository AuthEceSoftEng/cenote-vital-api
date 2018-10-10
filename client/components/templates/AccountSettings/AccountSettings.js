import React from 'react';
import { ChangeUsername, ChangePassword } from '../..';

export default function Account() {
	return (
		<div className="account-settings">
			<ChangeUsername />
			<ChangePassword />
		</div>
	);
}
