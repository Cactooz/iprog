import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {fetchSWDatabank} from "./fetch.js";
import Browse from "./presenters/browsePresenter.jsx";

function makeRouter(props) {
	function loader({request}){
		const url = new URL(request.url)
		const searchParam = url.pathname.replace("/","");
		const result = fetchSWDatabank(searchParam)
		model.setSearchResult(result);
		return result;
	}
	async function test({params,request}){
		console.log(params, request)
	}
	return createBrowserRouter([
		{
			path: '/',
			element: 'home',
		},
		{
			path: '/browse',
			element: 'browse',
		},
		{
			path: '/characters',
			element: <Browse model={props.model}/>,
			loader: loader,
			errorElement: <Browse model={props.model}/>
		},
		{
			path: '/locations',
			element: <Browse model={props.model}/>,
			loader: loader,
			errorElement: <Browse model={props.model}/>
		},
		{
			path: '/vehicles',
			element: <Browse model={props.model}/>,
			loader: loader,
			errorElement: <Browse model={props.model}/>
		},
	]);
}

export default
observer(
	function ReactRoot(props) {
	return <RouterProvider router={makeRouter(props)} />;
});
