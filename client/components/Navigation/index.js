import { connect } from 'react-redux';
import pick from 'ramda/src/pick';
import NavigationContainer from './NavigationContainer';

const mapStateToProps = pick(['user']);

export default connect(mapStateToProps)(NavigationContainer);
