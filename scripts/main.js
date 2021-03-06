var React = require('react');
var ReactDOM = require('react-dom');
// Router
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation; // mixin

var History = ReactRouter.History; 
var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers');

/*
	App
	<
*/
var App = React.createClass({
	
	getInitialState:function(){
		console.log('app initial state');
		return {
			fishes:{},
			order:{}
		}
	},

	addFish:function(fish){
		var timestamp = (new Date()).getTime();

		// Update state object
		this.state.fishes['fish-'+timestamp] = fish;

		// Set the state
		this.setState({fishes:this.state.fishes});
	},

	loadSamples:function(){
		this.setState({
			fishes: require('./sample-fishes')
		});
	},

	renderFish:function(key){
		return <Fish key={key} index={key} details={this.state.fishes[key]}/> 
	},

	render:function(){
		return(
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market"/>
					<ul className="list-of-fishes">
						{
							Object.keys(this.state.fishes).map(this.renderFish)
						}
					</ul>
				</div>
				<Order/>
				<Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
			</div>
		)
	}

});

/*
	Fish
	<Fish />
*/

var Fish = React.createClass({
	render:function(){
		return(
			<li class=>
			{this.props.index}
			</li>
		)
	}
});





/*
	Add Fish Form
	<AddFishForm/>
*/
var AddFishForm = React.createClass({
	
	getInitialState:function(){
		console.log('add fish form state');
		return null;
	},

	createFish:function(event){
		//1. Stop form from submitting
		event.preventDefault();

		//2. Take data from form and create an object
    var fish = {
      name : this.refs.name.value,
      price : this.refs.price.value,
      status : this.refs.status.value,
      desc : this.refs.desc.value,
      image : this.refs.image.value
    }

		//3. Add the fish to the App state
		this.props.addFish(fish);
		this.refs.fishForm.reset();
	},

	render:function(){
		return(
			<form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price" />
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to Image" />
        <button type="submit">+ Add Item </button>
      </form>
		)
	}

});

/*
	Header
*/
var Header = React.createClass({
	render:function(){
		console.log(this);
		return(
			<header className="top">
				<h1> Catch
					<span className="ofThe">
						<span className="of">of</span>
						<span className="the">the</span>
					</span>
				Day</h1>
				<h3 className="tagline"><span>{this.props.tagline}</span></h3>
			</header>
		)
	}
});

/*
	Order
*/
var Order = React.createClass({
	render:function(){
		return(
			<p>Order</p>
		)
	}
});

/*
	Inventory
*/
var Inventory = React.createClass({
	render:function(){
		return(
			<div>
				<h2>Inventory</h2>
				<AddFishForm {...this.props}/>
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		)
	}
});

/*
	StorePicker
	This will let us make <StorePicker>
*/
var	StorePicker = React.createClass({

	mixins :[History],

	render:function(){
		//var name = "sardi";
		return(			
			<form className="store-selector" onSubmit={this.goToStore}>
				{/*this is a comment in JSX*/}
				<h2>Please Enter A Store</h2>
				<input type="text" ref="storeId" defaultValue={h.getFunName()} required/>
				<input type="submit" />
			</form>
		)
	},

	goToStore:function(event){
		event.preventDefault();
		// get the data from the input
		var storeId = this.refs.storeId.value;
		this.history.pushState(null, '/store/' + storeId);
	}
});

/* 
	Not Found
*/ 
var NotFound = React.createClass({
	render:function(){
		return(
			<h1>404 Not Found</h1>
		)
	}
});

/*
	Routes
*/
var routes = (
	<Router history={createBrowserHistory()}>
		<Route path="/" component={StorePicker} />
		<Route path="/store/:storeId" component={App} />
		<Route path="*" component={NotFound} />
	</Router>
);

// Render on page
ReactDOM.render(routes, document.querySelector('#main'));

// Render function