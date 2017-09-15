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
	"Метель",
	"Легкая метель",//12
	"Переменная облачность",//13
	"Поземка",//14
	"Снег",//15
	"Град",//16
	"Гололедица",//17
	"Пыль",//18
	"Туманно",//19
	"Дымка",//20
	"Смог",//21
	"Порывистый ветер",//22
	"Ветрено",//23
	"Холодно",//24
	"Облачно",//25
	"Переменная облачность",//26
	"Переменная облачность",//27
	"Переменная облачность",//28
	"Переменная облачность",//29
	"Ясно",//30
	"Солнечно",//31
	"Ясно",//32
	"Ясно",//33
	"Дождь и град	",//34
	"Жара",//35
	"Местами грозы",//36
	"Возможна гроза",//37
	"Возможна гроза",//38
	"Местами дождии",//39
	"Сильный снег",//40
	"Дождь со снегом",//41
	"Сильный снег",//42
	"Облачно с прояснениями",//43
	"Гроза",//44
	"Снег с дождем",//45
	"Местами грозы"//46
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
		console.log(index);

		if(~["30", "31", "32", "33"].indexOf(index)) {
			return 'sun-o';
		}

		if(~["1", "2", "3", "4", "36", "37", "38", "44", "46"].indexOf(index)) {
			return 'bold';
		}

		if(~["15"].indexOf(index)) {
			return 'snowflake-o';
		}

		return 'question';
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

