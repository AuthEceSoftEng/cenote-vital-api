import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/about-page.css';

const AboutPage = () => (
	<div>
		<h2 className="alt-header">About</h2>
		<p>
			{'This example app is part of the '}
			<a href="https://github.com/coryhouse/react-slingshot">React-Slingshot starter kit</a>
			{'.'}
		</p>
		<p>
			<Link to="/badlink">Click this bad link</Link>
			{' '}
			{'to see the 404 page.'}
		</p>
	</div>
);

export default AboutPage;
