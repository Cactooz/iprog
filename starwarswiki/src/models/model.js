import { fetchSWAPI, fetchSWDatabank } from '../fetch.js';
import { queryClient } from '../main.jsx';

export default {
	user: {},
	favorites: [],
	maxFavorites: 9,
	isLoading: false,

	currentBrowse: undefined,
	browseResult: {},

	currentDetails: undefined,
	details: {},
	currentMoreDetails: undefined,
	moreDetails: {},
	currentHash: undefined,
	hash: {},

	searchResults: [],
	searchString: undefined,
	searchReady: true,
	autoCompleteResults: [],

	setAutoCompleteResults(results) {
		this.autoCompleteResults = results;
	},

	setSearchString(string) {
		this.searchString = string;
	},

	setUser(user) {
		this.user = user;
	},

	addToFavorites(fav) {
		this.favorites = [...this.favorites, fav];
	},

	removeFromFavorites(fav) {
		function findFavCB(item) {
			return fav.name !== item.name;
		}

		this.favorites = this.favorites.filter(findFavCB);
	},

	setFavsFromDB(data) {
		if (data === null) data = [];
		this.favorites = data;
	},

	unSetCurrentDetails() {
		this.currentDetails = undefined;
	},

	async setDetails(params) {
		this.detailsLoaded = false;
		await fetchSWDatabank(params, {}, params);
		this.details = queryClient.getQueryData(params);
		this.currentDetails = params;
	},

	async setMoreDetails(params) {
		this.detailsLoaded = false;
		if (params) {
			await fetchSWAPI(params, {}, params);
			this.moreDetails = queryClient.getQueriesData(params);
			this.currentMoreDetails = params;
		}
		this.detailsLoaded = true;
	},

	unSetCurrentBrowse() {
		this.currentBrowse = undefined;
	},

	async setBrowseResult(params) {
		this.isLoading = true;
		await fetchSWDatabank(params, {}, params);
		this.browseResult = queryClient.getQueryData(params);
		this.currentBrowse = params;
		await this.addMoreData();
	},

	async addMoreData() {
		this.isLoading = true;
		let string1 = this.browseResult?.info?.next?.replace('/api/v1/', '');
		if (string1) await this.addBrowseResult(string1);
		let string2 = this.browseResult?.info?.next?.replace('/api/v1/', '');
		if (string2) await this.addBrowseResult(string2);
		let string3 = this.browseResult?.info?.next?.replace('/api/v1/', '');
		if (string3) await this.addBrowseResult(string3);
		this.isLoading = false;
	},

	async addBrowseResult(params) {
		await fetchSWDatabank(params, {}, params);
		let data = [...this.browseResult.data, ...queryClient.getQueryData(params).data];
		let info = queryClient.getQueryData(params).info;

		this.browseResult = { data, info };
	},

	async setSearchResults() {
		this.searchReady = false;
		this.searchResults = await Promise.all(
			this.autoCompleteResults.map(async (item) => {
				let name = item.name.replaceAll('/', '%2F').replaceAll('.', '%2E');
				await fetchSWDatabank(`${item.type}/name/${name}`, {}, item.type + '/' + name);
				const object = queryClient.getQueryData(item.type + '/' + name)[0];
				object.path = '/' + item.type;
				return object;
			}),
		);
		this.searchReady = true;
	},

	setCurrentHash(hash, location) {
		this.hash = hash;
		this.currentHash = location;
	},
};
