import React from 'react';
import './index.css';

class CurrencyConverterBase extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currencies: ["AUD", "BGN", "BRL", "CAD", "CHF",
			"CNY", "CZK", "DKK", "GBP", "HKD", "HRK", "HUF",
			"IDR", "ILS", "INR", "ISK", "JPY", "KRW", "MXN",
			"MYR", "NOK", "NZD", "PHP", "PLN", "RON", "RUB",
			"SEK", "SGD", "THB", "TRY", "USD", "ZAR"],
			data: {},
			base: "AUD",
			convert: "USD",
			inputValue: 0,
			output: 0,
		};
	}

	updateData(bc, st, ed) {
		var exchangeRatesURL = "https://api.exchangeratesapi.io/latest?base=[BC]";
		exchangeRatesURL = exchangeRatesURL.replace('[BC]',
			this.state.base);
		fetch(exchangeRatesURL)
		.then(response => response.json())
		.then(jsonData => {
			this.setState((output) => ({
				data: jsonData,
			}));
		})
		.catch((error) => {
			console.error(error)
		})
	}
	
	componentDidMount() {
		this.updateData();
	}

	setBase(c) {
		this.setState({
			base: c,
		}, () => {
			this.updateData()
		});
	}

	setConvert(c) {
		this.setState({
			convert: c,
		});
	}


	updateInputValue(evt) {
		this.setState({ inputValue: evt.target.value });
	}

	convertCurrency() {
		const s = this.state;
		const c = s.data.rates[s.convert];
		this.setState((output) => ({
			output: (Number(this.state.inputValue) * c),
		}));
	}

	render() {
		const c = this.state.currencies;
		const out = this.state.output;
		const selectBaseCurrency = c.map((name) => {
			return (
				<option
				onClick={() => this.setBase(name)} 
				selected={name === this.state.base}
				>
						{name}
				</option>
			);
		});
		const selectConvertCurrency = c.map((name) => {
			return (
				<option
				onClick={() => this.setConvert(name)} 
				selected={name === this.state.convert}
				>
						{name}
				</option>
			);
		});
		return (
			<div class="main-convert">
			<div class="convert-div">
			<h3>Convert: </h3>
			<input value={this.state.inputValue} type="number" onChange={evt => this.updateInputValue(evt)}/>
			<select>{selectBaseCurrency}</select>
			</div>
			<div class="convert-div">
			<h3> to </h3>
			<select>{selectConvertCurrency}</select>
			<button onClick={() => this.convertCurrency()}>Convert</button>
			</div>
			<div class="convert-div">
			<h3> = {out}</h3>
			</div>
			</div>
		);
	}
}

export default CurrencyConverterBase;


