/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';

const MostRecentEvents = (props) => {
  const { properties, events } = props;
  return (
    <div className="container is-fluid">
      {
        Object.keys(events).length
          ? (
            <table className="table has-text-centered" align="center">
              <thead>
                <tr>
                  <th className="has-text-centered"><abbr title="Serial Number">No.</abbr></th>
                  {
                    properties.map((prop, ind) => (
                      <th key={`th_key_${ind}`} className="has-text-centered">{prop.column_name}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {
                  events.map((prop, ind) => (
                    <tr key={`tr_key_${ind}`}>
                      <th className="has-text-centered">{ind + 1}</th>
                      {
                        properties.map((prop2, ind2) => (
                          <td
                            key={`td_key_${ind2}`}
                            className={`has-text-centered ${prop2.column_name.startsWith('cenote') ? 'has-text-danger' : 'has-text-info'}`}
                          >
                            {prop[prop2.column_name] || '-'}
                          </td>
                        ))
                      }
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

MostRecentEvents.propTypes = { properties: PropTypes.array.isRequired, events: PropTypes.array.isRequired };

export default MostRecentEvents;
