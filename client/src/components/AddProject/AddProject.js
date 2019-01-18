import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

const AddProject = (props) => {
  const { title, updateTitle, addProject } = props;
  return (
    <div className="add-project columns is-gapless">
      <div className="column is-10">
        <input className="input" type="text" value={title} onChange={updateTitle} />
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
  title: PropTypes.string.isRequired,
  updateTitle: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
};

export default AddProject;
