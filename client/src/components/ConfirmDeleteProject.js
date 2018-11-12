import React from 'react';
import PropTypes from 'prop-types';

export default function ConfirmDeleteProject({ closeModal, deleteProject }) {
	return (
		<div className="card">
			<div className="card-content">
				<div className="content has-text-centered">Are you sure you wanted to delete this project?</div>
			</div>
			<footer className="card-footer">
				<div className="card-footer-item" role="button" tabIndex={0} onClick={closeModal} onKeyPress={closeModal}>Cancel</div>
				<div className="card-footer-item" role="button" tabIndex={-1} onClick={deleteProject} onKeyPress={deleteProject}>Delete</div>
			</footer>
		</div>
	);
}

ConfirmDeleteProject.propTypes = {
	closeModal: PropTypes.func.isRequired,
	deleteProject: PropTypes.func.isRequired,
};
