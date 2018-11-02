import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

const AddProject = (props) => {
	const { text, updateText, addProject } = props;
	return (
		<div className="add-project columns is-gapless">
			<div className="column is-10">
				<input className="input" type="text" value={text} onChange={updateText} />
			</div>
			<div className="column is-2">
				<Button
					style={{ width: '100%' }}
					onClick={addProject}
					label="Add"
					type="success"
				/>
			</div>
		</div>
	);
};

AddProject.propTypes = {
	text: PropTypes.string.isRequired,
	updateText: PropTypes.func.isRequired,
	addProject: PropTypes.func.isRequired,
};

export default AddProject;
