import AddStar from '../components/AddStar';
import RemoveStar from '../components/RemoveStar';
import Toastify from '../components/Toastify';
import { toast } from 'react-toastify';

function DetailsView(props) {
	function findFavCB(item) {
		return item.name === props.name;
	}

	function removeACB() {
		props.removeFavorite(object);
	}

	function addACB() {
		if (props.fav.length >= props.maxFavorites)
			toast.info(`You can have up to ${props.maxFavorites} favorites. Remove some to add more!`);
		else props.addFavorite(object);
	}

	const object = { id: props.id, name: props.name, image: props.image, path: '/' + props.path };

	return (
		<div className='details-container'>
			<img src={props.image} />
			<div className='details'>
				<div className='details-title'>
					<h2>{props.name}</h2>
					{props.loggedIn ? (
						props.fav.find(findFavCB) ? (
							<button onClick={removeACB}>
								<RemoveStar />
							</button>
						) : (
							<>
								<button onClick={addACB}>
									<AddStar />
								</button>
								<Toastify />
							</>
						)
					) : (
						<>
							<button onClick={() => toast.info('Sign in to add items to your favorites!')}>
								<AddStar />
							</button>
							<Toastify />
						</>
					)}
					<p>{props.path.replace('s', '')}</p>
				</div>
				<p>{props.details}</p>
			</div>
		</div>
	);
}

export default DetailsView;
