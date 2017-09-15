import React, {Component, PropTypes} from 'react';
import debounce from 'lodash.debounce'
//import './style.css'

const defaultStyles = {
	root: {
		position: 'relative',
		paddingBottom: '0px',
	},
	input: {
		display: 'inline-block',
		width: '100%',
		height: '100%',
		padding: '0 5px',
		boxSizing: 'border-box'
	},
	autocompleteContainer: {
		position: 'absolute',
		top: '100%',
		backgroundColor: 'white',
		zIndex: 1000,
		border: '1px solid #555555',
		width: '100%'
	},
	autocompleteItem: {
		backgroundColor: '#ffffff',
		padding: '10px',
		color: '#555555',
		cursor: 'pointer',
		textAlign: 'left'
	},
	autocompleteItemActive: {
		backgroundColor: '#fafafa'
	}
}

class Search extends Component {
	constructor(props) {
		super(props)

		this.state = {
			value: '',
			autocompleteItems: []
		};

		this.autocompleteCallback = this.autocompleteCallback.bind(this);
		this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.debouncedFetchPredictions = debounce(this.fetchPredictions, 200);
	}

	componentDidMount() {
		if (!window.google) {
			throw new Error('Google Maps JavaScript API library must be loaded.');
		}

		if (!window.google.maps.places) {
			throw new Error('Google Maps Places library must be loaded. Please add `libraries=places` to the src URL.');
		}

		this.autocompleteService = new google.maps.places.AutocompleteService();
		this.autocompleteOK = google.maps.places.PlacesServiceStatus.OK;
	}

	autocompleteCallback(predictions, status) {
		if (status != this.autocompleteOK) {
			this.props.onError(status);
			if (this.props.clearItemsOnError) {
				this.clearAutocomplete();
			}
			return;
		}


		const formattedSuggestion = (structured_formatting) => ({
			mainText: structured_formatting.main_text,
			secondaryText: structured_formatting.secondary_text,
		});

		const { highlightFirstSuggestion } = this.props;

		let cities = predictions.filter((item) => {
			return (~item.types.indexOf('locality'))
		});

		this.setState({
			autocompleteItems: cities.map((p, idx) => ({
				suggestion: p.terms[0].value,
				placeId: p.place_id,
				active: (highlightFirstSuggestion && idx === 0 ? true : false),
				index: idx,
				formattedSuggestion: formattedSuggestion(p.structured_formatting),
			}))
		})
	}


	fetchPredictions() {
		const { value } = this.state;

		if (value.length) {
			this.autocompleteService.getPlacePredictions({
				...this.props.options,
				input: value
			}, this.autocompleteCallback)
		}
	}

	clearAutocomplete() {
		this.setState({ autocompleteItems: [] })
	}

	getInlineStyle(...props) {
		const { classNames, styles } = this.props;

		if (props.some(prop => classNames.hasOwnProperty(prop))) {
			return {}
		}

		return props.reduce((acc, prop) => {
			return {
				...acc,
				...defaultStyles[prop],
				...styles[prop],
			}
		}, {})
	}

	getClassName(...props) {
		const { classNames } = this.props;

		return props.reduce((acc, prop) => {
			const name = classNames[prop] || '';
			return name ? `${acc} ${name}` : acc;
		}, '')
	}

	getInputProps() {
		const defaultInputProps = {
			type: "text",
			autoComplete: "off",
		}

		return {
			...defaultInputProps,
			...this.props.inputProps,
			onChange: (event) => {
				this.handleChange(event);
			},
			onKeyDown: (event) => {
				this.handleInputKeyDown(event);
			},
			onBlur: (event) => {
				this.handleBlur(event);
			},
			style: this.getInlineStyle('input'),
			className: this.getClassName('input'),
		}
	}

	handleChange(event) {

		if(this.props.inputProps.onChange)
			this.props.inputProps.onChange(event.target.value);

		if (!event.target.value) {
			this.clearAutocomplete();
		}

		this.setState({
			value: event.target.value
		}, this.debouncedFetchPredictions);
	}

	handleBlur(event) {
		this.clearAutocomplete();

		if (this.props.inputProps.onBlur) {
			this.props.inputProps.onBlur(event);
		}
	}

	handleKeyEnter() {
		const activeItem = this.getActiveItem()
		if (activeItem === undefined) {
			this.handleKeyEnterWithoutActiveItem()
		} else {
			this.selectAddress(activeItem.suggestion, activeItem.placeId);
		}
	}

	handleKeyEnterWithoutActiveItem() {
		if (this.props.onKeyDownEnter) {
			this.props.onKeyDownEnter(this.props.inputProps.value)
			this.clearAutocomplete()
		} else {
			return;
		}
	}

	handleKeyDown() {
		if (this.state.autocompleteItems.length === 0) {
			return;
		}

		const activeItem = this.getActiveItem()
		if (activeItem === undefined) {
			this.selectActiveItemAtIndex(0);
		} else {
			const nextIndex = (activeItem.index + 1) % this.state.autocompleteItems.length;
			this.selectActiveItemAtIndex(nextIndex);
		}
	}

	handleKeyUp() {
		if (this.state.autocompleteItems.length === 0) {
			return;
		}

		const activeItem = this.getActiveItem();
		if (activeItem === undefined) {
			this.selectActiveItemAtIndex(this.state.autocompleteItems.length - 1);
		} else {
			let prevIndex;
			if (activeItem.index === 0) {
				prevIndex = this.state.autocompleteItems.length - 1;
			} else {
				prevIndex = (activeItem.index - 1) % this.state.autocompleteItems.length;
			}
			this.selectActiveItemAtIndex(prevIndex);
		}
	}

	handleInputKeyDown(event) {
		switch (event.key) {
			case 'Enter':
				event.preventDefault();
				this.handleKeyEnter();
				break;
			case 'ArrowDown':
				event.preventDefault();
				this.handleKeyDown();
				break;
			case 'ArrowUp':
				event.preventDefault();
				this.handleKeyUp();
				break;
			case 'Escape':
				this.clearAutocomplete();
				break;
		}

		if (this.props.inputProps.onKeyDown) {
			this.props.inputProps.onKeyDown(event);
		}
	}

	setActiveItemAtIndex(index) {
		this.setState({
			autocompleteItems: this.state.autocompleteItems.map((item, idx) => {
				if (idx === index) {
					return { ...item, active: true }
				} else {
					return { ...item, active: false }
				}
			})
		})
	}

	selectActiveItemAtIndex(index) {
		const activeName = this.state.autocompleteItems.find(item => item.index === index).suggestion;

		this.setActiveItemAtIndex(index);

		if(this.props.inputProps.onChange)
			this.props.inputProps.onChange(activeName);
	}

	selectAddress(address, placeId) {
		this.clearAutocomplete();
		this.handleSelect(address, placeId);
	}

	handleSelect(address, placeId) {
		this.setState({
			value: address
		}, () => {
			if(this.props.onSelect)
				this.props.onSelect(address, placeId);
		});
	}

	render() {
		const { classNames, styles } = this.props;
		const { autocompleteItems } = this.state;
		const inputProps = this.getInputProps();

		return (
			<div
				id="search__root"
				style={this.getInlineStyle('root')}
				className={this.getClassName('root')}>
				<input {...inputProps} value={this.state.value} />
				{autocompleteItems.length > 0 && (
					<div
						id="search__autocomplete"
						style={this.getInlineStyle('autocompleteContainer')}
						className={this.getClassName('autocompleteContainer')}>
						{autocompleteItems.map((p, idx) => (
							<div
								key={p.placeId}
								onMouseOver={() => this.setActiveItemAtIndex(p.index)}
								onMouseDown={() => this.selectAddress(p.suggestion, p.placeId)}
								onTouchStart={() => this.setActiveItemAtIndex(p.index)}
								onTouchEnd={() => this.selectAddress(p.suggestion, p.placeId)}
								style={ p.active ? this.getInlineStyle('autocompleteItem', 'autocompleteItemActive') : this.getInlineStyle('autocompleteItem') }
								className={ p.active ? this.getClassName('autocompleteItem', 'autocompleteItemActive') : this.getClassName('autocompleteItem') }>
								{this.props.autocompleteItem({ suggestion: p.suggestion, formattedSuggestion: p.formattedSuggestion })}
							</div>
						))}
					</div>
				)}
			</div>
		)
	}
}

Search.propTypes = {
	onError: PropTypes.func,
	clearItemsOnError: PropTypes.bool,
	onSelect: PropTypes.func,
	autocompleteItem: PropTypes.func,
	classNames: PropTypes.shape({
		root: PropTypes.string,
		input: PropTypes.string,
		autocompleteContainer: PropTypes.string,
		autocompleteItem: PropTypes.string,
		autocompleteItemActive: PropTypes.string
	}),
	styles: PropTypes.shape({
		root: PropTypes.object,
		input: PropTypes.object,
		autocompleteContainer: PropTypes.object,
		autocompleteItem: PropTypes.object,
		autocompleteItemActive: PropTypes.object
	})
}

Search.defaultProps = {
	clearItemsOnError: false,
	onError: (status) => console.error('[search-input]: error happened when fetching data from Google Maps API.\n', status),
	classNames: {},
	autocompleteItem: ({ suggestion }) => (<div>{suggestion}</div>),
	styles: {},
	options: {
		componentRestrictions: {
			country: 'ru'
		}
	}
}



export default Search;
