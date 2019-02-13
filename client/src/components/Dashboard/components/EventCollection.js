import React from 'react';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import swal from '@sweetalert/with-react';
import { equals } from 'ramda';

import Button from '../../Button';

const EventCollection = (props) => {
  const { properties } = props;
  const [data, updateData] = React.useState(properties);
  let table = null;
  const handleSave = () => {
    if (equals(data, data.map(el => ({ column_name: el.column_name, type: el.type })))) return;
    updateData(data.map(el => ({ column_name: el.column_name, type: el.type })));
    swal('Good job!', 'Changes have been saved!', 'success');
  };
  const handleDelete = () => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover data lost!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        updateData(data.filter(el => !table.selectionContext.state.selected.includes(el.column_name)));
        swal('Poof! Your column(s) have been deleted!', { icon: 'success' });
      } else {
        swal('Your collection is safe!');
      }
    });
  };
  const rowStyle = row => (row.isUnsaved ? ({ backgroundColor: 'lightgrey' }) : {});
  const handleOnSelect = (row, isSelect) => !(isSelect && (['cenote', 'uuid'].some(el => row.column_name.startsWith(el)) || row.isUnsaved));
  const selectRow = {
    mode: 'checkbox',
    hideSelectAll: true,
    style: { backgroundColor: '#c8e6c9' },
    onSelect: handleOnSelect,
    clickToSelect: true,
    clickToEdit: true,
  };
  const columns = [
    {
      dataField: 'column_name',
      text: 'Property Name',
      align: 'center',
      headerAlign: 'center',
      classes: (_, row) => (row.column_name.startsWith('cenote') || row.column_name.startsWith('uuid') ? 'has-text-danger' : 'has-text-info'),
      editable: (_, row) => row.isUnsaved,
      editorStyle: { backgroundColor: 'white' },
      sort: true,
    },
    {
      dataField: 'type',
      text: 'Property Price',
      align: 'center',
      headerAlign: 'center',
      classes: (_, row) => (row.column_name.startsWith('cenote') || row.column_name.startsWith('uuid') ? 'has-text-danger' : 'has-text-info'),
      editable: (_, row) => row.isUnsaved,
      editor: {
        type: Type.SELECT,
        options: [{ value: 'float', label: 'float' }, { value: 'text', label: 'text' }, { value: 'timestamp', label: 'timestamp' }],
      },
      sort: true,
    }];
  return (
    <div className="container is-fluid" style={{ display: 'block', overflowX: 'auto', whiteSpace: 'nowrap' }}>
      {
      Object.keys(data).length
        ? (
          <div>
            <BootstrapTable
              ref={r => table = r}
              keyField="column_name"
              classes="table"
              data={data}
              columns={columns}
              selectRow={selectRow}
              wrapperClasses="container is-fluid"
              cellEdit={cellEditFactory({ mode: 'click', blurToSave: true })}
              rowStyle={rowStyle}
            />
            <div className="is-grouped" role="group">
              <Button onClick={() => updateData(data.concat({ column_name: '<Property Name>', type: 'text', isUnsaved: true }))} label="+" />
              <Button onClick={handleSave} label="Save" type="success" />
              <Button onClick={handleDelete} label="Delete" type="danger" />
            </div>
          </div>
        ) : (<ClipLoader color="#008B8B" />)
    }
    </div>

  );
};

EventCollection.propTypes = { properties: PropTypes.array.isRequired };

export default EventCollection;
