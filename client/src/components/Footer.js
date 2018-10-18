import React from 'react';
import { connect } from 'react-redux';
import { pick } from 'ramda';

export const Footer = () => {
	const year = new Date().getFullYear();

	return (
		<footer className="footer">
			<div className="container">
				<div className="content has-text-centered">
					<p>
						{`Copyright Ⓒ ${year} SoftEng Group, Intelligent Systems & Software Engineering Labgroup. All Rights Reserved.`}
					</p>
				</div>
			</div>
		</footer>
	);
};
const mapStateToProps = pick([]);

export default connect(mapStateToProps)(Footer);
