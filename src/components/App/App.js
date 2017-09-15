import React, {Component} from 'react';
import Search  from '../Search/index'
import Button from '../Button/index'
import Wizard  from '../Wizard/index'
import InputRange from 'react-input-range';
import { connect } from 'react-redux';
import { fetchWeather, removeWeather } from '../../actions';


import 'react-input-range/lib/css/index.css'
import '../../../styles/font-awesome.min.css'
import './style.css'


class App extends Component  {
	constructor(props) {
		super(props);

		this.state = {
			currentCity: '',
			filterValue: -50
		}

	}

	componentWillUpdate(nextProps, nextState) {
		console.log(nextProps)
	}



	renderWizards() {
		return this.props.forecasts.map((p, index) => {
			if(p.item.condition.temp > this.state.filterValue) {
				return <Wizard
					city={p.city}
					temp={p.item.condition.temp}
					code={p.item.condition.code}
					visible={(p.item.condition.temp >= this.state.filterValue) ? true : false}
					onClose={this.removeForecast.bind(this)}
					key={index}
				/>
			}
		})
	}

	addForecast() {
		if(!this.isExistCity(this.state.currentCity))
			this.props.dispatch(fetchWeather(this.state.currentCity));
	}

	removeForecast(city) {
		this.props.dispatch(removeWeather(city));
	}

	isExistCity(city) {
		return this.props.forecasts.some((item) => {
			return item.city == city;
		})
	}

	handleSelect(currentCity) {
		this.setState({currentCity: currentCity})
	}

	render() {

		const inputProps = {
			value: this.state.currentCity
		}

		const searchStyles = {
			root: {
				width: '300px',
				height: '35px',
				display: 'inline-block'
			}
		}

		const btnStyles = {
			width: '35px',
			height: '35px'
		}

		return (
			<div className="wrapper">
				<h2>Маябрь</h2>
				<div className="inlineBlock">
					<Search inputProps={inputProps} styles={searchStyles} onSelect={this.handleSelect.bind(this)}/>
					<Button text="+" styles={btnStyles} onClick={this.addForecast.bind(this)}/>
				</div>
				<div className="inlineBlock">
					<span className="question">Где сейчас теплее чем: </span>
					<div className="inlineBlock">
						<InputRange
							maxValue={50}
							minValue={-50}
							formatLabel={value => `${value} °C`}
							value={this.state.filterValue}
							onChange={value => this.setState({ filterValue: value })}
						/>
					</div>
				</div>

				<div className="wizardsContainer">
					{this.renderWizards()}
				</div>
			</div>
		)
	}
}

App.defaultProps = {
	forecasts: []
}

const mapStateToProps = (state) => {
	return {
		forecasts: !state.weather.isFetching ? [...state.weather.forecasts] : []
	};
};

App = connect(mapStateToProps)(App);

export default App;
