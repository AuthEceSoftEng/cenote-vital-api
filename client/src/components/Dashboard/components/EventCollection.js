import React from 'react';

const EventCollection = () => (
	<div className="container is-fluid">
		<table className="table has-text-centered" align="center">
			<thead>
				<tr>
					<th className="has-text-centered"><abbr title="Number">No.</abbr></th>
					<th className="has-text-centered">Property</th>
					<th className="has-text-centered">Type</th>
					<th className="has-text-centered"><abbr title="Unique">U</abbr></th>
					<th className="has-text-centered"><abbr title="Null">N</abbr></th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th className="has-text-centered">1</th>
					<td className="has-text-centered has-text-link">name</td>
					<td className="has-text-centered">String</td>
					<td className="has-text-centered">Y</td>
					<td className="has-text-centered">N</td>
				</tr>
			</tbody>
		</table>
	</div>
);

export default EventCollection;
