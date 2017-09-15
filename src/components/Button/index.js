import React, {Component, PropTypes} from 'react'
import './style.css'

class Button extends Component {
	constructor(props) {
		super(props);
	}

	render = () => {
		return (
			<div className="button">
				<button style={this.props.styles} className="button__btn" onClick={this.props.onClick}>
					<span className={`button__text`}>{this.props.text}</span>
				</button>
			</div>

		)
	}
}

Button.propTypes = {
	text: PropTypes.string.isRequired,
	styles: PropTypes.object
}


export default Button;
