import React from 'react';
import ReactDOM from 'react-dom';
import ExchangeRateBase from './currency_graph.js';
import CurrencyConverterBase from './currency_converter.js';
import './index.css';

class CurrencyBase extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showGraph: true,
		}
	}

	toggleGraph(a) {
		this.setState({
			showGraph: a,
		});
	}

	render() {
		const showGraph = this.state.showGraph;
		return (
			<div>
			<button class="tabs" id={showGraph ? "active-tab": ""} onClick={() => this.toggleGraph(true)}>Exchange Rate Graph</button>
			<button class="tabs" id={!showGraph ? "active-tab": ""} onClick={() => this.toggleGraph(false)}>Currency Converter</button>
			{
				showGraph ? 
				<ExchangeRateBase/>:
				<CurrencyConverterBase/>
			}
			</div>
		);
	}
}

ReactDOM.render(
	<CurrencyBase />,
	document.getElementById('root')
);

