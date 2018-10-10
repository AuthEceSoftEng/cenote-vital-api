import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import pick from 'ramda/src/pick';
import LoginPageContainer from './LoginPageContainer';

const mapStateToProps = pick(['user']);

const mapDispatchToProps = dispatch => ({ pushToHome: () => dispatch(push('/home')) });

export default connect(mapStateToProps, mapDispatchToProps)(LoginPageContainer);
