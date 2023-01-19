global.CoreHelpers = {
  token: require("./services/token.js"),
  validateEmail: (email) => email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
};
// global data
global.AppData = {
	safeString: (string) => {
		return string.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
	},
	defaultColours: ['#F57E4A','#008D89','#FFBD4D','#00ABB8','#F84C63','#B783DE','#0079BF','#61BD4F','#FF78CB','#7AE4F1','#344563','#F6553F','#C9E262','#6E798A','#8571CB'],
	defaultTags: [
	
		{
			name: 'Eviction',
			colour: '#F57E4A'
		}, 
		{
			name: 'Vacant',
			colour: '#008D89'
		}, 
		{
			name: 'Tax Delinquent',
			colour: '#FFBD4D'
		}, 
		{
			name: 'Pre-Foreclosure',
			colour: '#00ABB8'
		}, 
		{
			name: 'Divorce',
			colour: '#F84C63'
		}, 
		{
			name: 'Absentee Owner',
			colour: '#6E798A'
		}, 
		{
			name: 'Probate',
			colour: '#B783DE'
		},
	],
};