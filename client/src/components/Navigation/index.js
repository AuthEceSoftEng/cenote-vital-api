import { connect } from 'react-redux';
import { pick } from 'ramda';
import NavigationContainer from './NavigationContainer';

const mapStateToProps = pick(['user']);

export default connect(mapStateToProps)(NavigationContainer);
