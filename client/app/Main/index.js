import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import pick from 'ramda/src/pick';

import MainContainer from './MainContainer';

const mapStateToProps = pick(['alerts']);

export default connect(mapStateToProps)(withRouter(MainContainer));
