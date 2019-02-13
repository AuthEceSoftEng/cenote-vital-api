import React from 'react';
import PropTypes from 'prop-types';
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faBan, faPencilAlt, faSave } from '@fortawesome/free-solid-svg-icons';
import swal from '@sweetalert/with-react';

export default function Project(props) {
  const {
    edit, title, currentTitle, updated, createdMessage, updatedMessage, openProjectInfo, updateTitle, updateProjectTitle,
    editProject, cancelEdit, deleteProject,
  } = props;

  const openModal = () => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover data lost!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteProject();
        swal('Poof! Your project has been deleted!', { icon: 'success' });
      } else {
        swal('Your project is safe!');
      }
    });
  };

  return (
    <li className="project box">
      <article className="media">
        <div className="media-content">
          <div className="content">
            <p>
              <small>
                {`created ${createdMessage}`}
              </small>
            </p>
            {edit ? (
              <form onSubmit={(evt) => {
                updateProjectTitle();
                evt.preventDefault();
              }}
              >
                <input className="input" type="text" value={currentTitle} onChange={updateTitle} ref={inpt => inpt && inpt.focus()} />
              </form>
            ) : (
              <p>
                {title}
              </p>
            )}
          </div>

          <nav className="level is-mobile">
            <div className="level-left">
              {updated && (
                <small>
                  {`edited ${updatedMessage}`}
                </small>
              )}
            </div>
            <div className="level-right">
              <span className="icon space-right" role="button" tabIndex={0} onClick={openProjectInfo} onKeyPress={openProjectInfo}>
                <FontAwesomeIcon icon={faFolderOpen} color="orange" size="lg" />
              </span>
              {edit ? (
                <span
                  className="icon
                space-right"
                  role="button"
                  tabIndex={0}
                  onClick={updateProjectTitle}
                  onKeyPress={updateProjectTitle}
                >
                  <FontAwesomeIcon icon={faSave} size="lg" />
                </span>
              ) : (
                <span className="icon space-right" role="button" tabIndex={0} onClick={editProject} onKeyPress={editProject}>
                  <FontAwesomeIcon icon={faPencilAlt} size="lg" />
                </span>
              )}
              {edit ? (
                <span className="icon" role="button" tabIndex={-1} onClick={cancelEdit} onKeyPress={cancelEdit}>
                  <FontAwesomeIcon icon={faBan} size="lg" />
                </span>
              ) : (
                <span className="icon" role="button" tabIndex={-1} onClick={openModal} onKeyPress={cancelEdit}>
                  <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                </span>
              )}
            </div>
          </nav>
        </div>
      </article>
    </li>
  );
}

Project.propTypes = {
  edit: PropTypes.bool.isRequired,
  updated: PropTypes.bool.isRequired,

  title: PropTypes.string.isRequired,
  currentTitle: PropTypes.string.isRequired,
  createdMessage: PropTypes.string.isRequired,
  updatedMessage: PropTypes.string.isRequired,

  openProjectInfo: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
  updateProjectTitle: PropTypes.func.isRequired,
  editProject: PropTypes.func.isRequired,
  cancelEdit: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
};
