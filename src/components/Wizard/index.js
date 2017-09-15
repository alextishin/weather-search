import React, {Component, PropTypes} from 'react';
import './style.css'

const conditionsRus = [
	"Торнадо",//0
	"Тропический шторм	",//1
	"Ураган",//2
	"Сильные грозы",//3
	"Грозы",//4
	"Дождь со снегом",//5
	"Дождь и мокрый снег",//6
	"Переменная облачность",//7
	"Переменная облачность",//8
	"Изморось",//9
	"Ледяной дождь",//10
	"Ливни",//11
	"Метель",//12
	"Легкая метель",//13
	"Переменная облачность",//14
	"Поземка",//15
	"Снег",//16
	"Град",//17
	"Гололедица",//18
	"Пыль",//19
	"Туманно",//20
	"Дымка",//21
	"Смог",//22
	"Порывистый ветер",//23
	"Ветрено",//24
	"Холодно",//25
	"Облачно",//26
	"Переменная облачность",//27
	"Переменная облачность",//28
	"Переменная облачность",//29
	"Переменная облачность",//30
	"Ясно",//31
	"Солнечно",//32
	"Ясно",//33
	"Ясно",//34
	"Дождь и град	",//35
	"Жара",//36
	"Местами грозы",//37
	"Возможна гроза",//38
	"Возможна гроза",//39
	"Местами дождии",//40
	"Сильный снег",//41
	"Дождь со снегом",//42
	"Сильный снег",//43
	"Облачно с прояснениями",//44
	"Гроза",//45
	"Снег с дождем",//46
	"Местами грозы"//47
];


class Wizard extends Component {
	constructor(props) {
		super(props)

		this.handleClose = this.handleClose.bind(this);
	}

	handleClose() {
		if(this.props.onClose)
			this.props.onClose(this.props.city)
	}

	setImage(index) {
		console.log(index)

		if(~["31", "32", "33", "34"].indexOf(index)) {
			return 'sun-o';
		}

		if(~["1", "2", "3", "4", "37", "38", "39", "45", "47"].indexOf(index)) {
			return 'bold';
		}

		if(~["16"].indexOf(index)) {
			return 'snowflake-o';
		}

		if(~["7", "8", "20", "21", "27", "28", "29", "30"].indexOf(index)) {
			return 'cloud';
		}

		if(~["10", "11", "6", "5", "35", "46"].indexOf(index)) {
			return 'tint';
		}

		return 'thermometer-quarter';

	}

	render() {
		return (
			<div className={`wizzard ${!this.props.visible ? 'hidden' : ''}`}>
				<div className="wizzard__city">
					<span>{this.props.city}</span>
				</div>
				<div className="wizzard__forecast forecast">
					<i className={`fa fa-${this.setImage(this.props.code)} fa-3x`} aria-hidden="true"></i>
					<span className="forecast__temp">
						{this.props.temp}
						<sup>o</sup>C
					</span>
				</div>
				<div className="wizzard__text">
					{conditionsRus[this.props.code]}
				</div>
				<div className="wizzard__wind"></div>
				<div className="wizzard__pressure"></div>
				<button className="wizzard__close" onClick={this.handleClose}>
					<i className="fa fa-times" aria-hidden="true"></i>
				</button>
			</div>
		)
	}
}

Wizard.propTypes = {
	city: React.PropTypes.string,
	temp: React.PropTypes.string,
	visible: React.PropTypes.bool
};

export default Wizard;

