import LandingPageView from '../views/landingPageView';
import SearchBarPresenter from './searchBarPresenter';
import { observer } from 'mobx-react-lite';

export default observer(function LandingPagePresenter(props) {
	return (
		<>
			<SearchBarPresenter model={props.model} />{' '}
			<LandingPageView user={props.model.user} model={props.model} />
		</>
	);
});
