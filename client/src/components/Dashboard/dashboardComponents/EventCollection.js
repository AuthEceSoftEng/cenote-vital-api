/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';

const EventCollection = (props) => {
  const { properties } = props;
  return (
    <div className="container is-fluid">
      {
        Object.keys(properties).length
          ? (
            <table className="table has-text-centered" align="center">
              <thead>
                <tr>
                  <th className="has-text-centered"><abbr title="Serial Number">No.</abbr></th>
                  <th className="has-text-centered"><abbr title="Property's Name">Name</abbr></th>
                  <th className="has-text-centered"><abbr title="Property's Types">Type</abbr></th>
                </tr>
              </thead>
              <tbody>
                {
                  properties.map((prop, ind) => (
                    <tr key={`tr_key_${ind}`}>
                      <th className="has-text-centered">{ind + 1}</th>
                      <td className={`has-text-centered ${prop.column_name.startsWith('cenote') ? 'has-text-danger' : 'has-text-info'}`}>
                        {prop.column_name}
                      </td>
                      <td className={`has-text-centered ${prop.column_name.startsWith('cenote') ? 'has-text-danger' : 'has-text-info'}`}>
                        {prop.type}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          ) : (<ClipLoader color="#008B8B" />)
      }
    </div>
  );
};

EventCollection.propTypes = { properties: PropTypes.array.isRequired };

export default EventCollection;
