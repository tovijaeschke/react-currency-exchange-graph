import React from 'react';
import {Line} from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import './index.css';

import "react-datepicker/dist/react-datepicker.css";


function getCurrencyList(er, key) {
	var l = [];
	for (var i in er) {
		l.push(er[i][1][key]);
	}
	return l;
}

function getDatasets(er) {
	var datasetList = [];
	var e = Object.keys(er[0][1]);
	for (var i in e) {
		if (e[i] === "IDR" || e[i] === "KRW") {
			continue;
		}
		var dataset = {
			label: e[i],
			data: getCurrencyList(er, e[i]),
		};
		datasetList.push(dataset);
	}
	return datasetList;
}

function sortByKey(jsObj){
	var sortedArray = [];
	for(var i in jsObj) {
		sortedArray.push([i, jsObj[i]]);
	}
	return sortedArray.sort();
}

function getSortedDates(jsObj) {
	var sortedDates = [];
	for (var i in jsObj) {
		sortedDates.push(jsObj[i][0])
	}
	return sortedDates;
}

function formatDate(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return [year, month, day].join('-');
}

function getLastYearDate() {
	var d = new Date();
	var pastYear = d.getFullYear() - 1;
	d.setFullYear(pastYear);
	return d;
}

class ExchangeRateGraph extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {
				labels: [],
				datasets: [],
			},
			bc: this.props.bc,
			sd: this.props.sd,
			ed: this.props.ed,
		};
	}

	componentWillReceiveProps(newProps) {
		this.setState({
			bc: newProps.bc,
			sd: newProps.sd,
			ed: newProps.ed,
		}, () => {
			this.updateData()
		});
	}

	updateData(bc, st, ed) {
		var exchangeRatesURL = "https://api.exchangeratesapi.io/history?start_at=[SD]&end_at=[ED]&base=[BC]";
		exchangeRatesURL = exchangeRatesURL.replace('[BC]',
			this.state.bc);
		exchangeRatesURL = exchangeRatesURL.replace('[SD]',
			formatDate(this.state.sd));
		exchangeRatesURL = exchangeRatesURL.replace('[ED]',
			formatDate(this.state.ed));
		fetch(exchangeRatesURL)
		.then(response => response.json())
		.then(jsonData => {
			var sorted = sortByKey(jsonData.rates)
			this.setState({
				data: {
					labels: getSortedDates(sorted),
					datasets: getDatasets(sorted),
				}
			})
		})
		.catch((error) => {
			console.error(error)
		})
	}
	
	componentDidMount() {
		this.updateData();
	}

	/*
	data = {
		labels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		datasets: [
			{
				label: this.props.bc,
				//backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'red',
				pointBackgroundColor: '#000',
				data: [0, 10, 5, 2, 20, 30, 45],
			},
		],
	};
	*/
	render() {
		return (
			<div>
			< Line data={this.state.data}/>

			</div>
		);
	}
}


class ExchangeRateBase extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currencies: ["AUD", "BGN", "BRL", "CAD", "CHF",
			"CNY", "CZK", "DKK", "GBP", "HKD", "HRK", "HUF",
			"IDR", "ILS", "INR", "ISK", "JPY", "KRW", "MXN",
			"MYR", "NOK", "NZD", "PHP", "PLN", "RON", "RUB",
			"SEK", "SGD", "THB", "TRY", "USD", "ZAR"],
		base: "AUD",
		startDate: getLastYearDate(),
		endDate: new Date(),
		};
		this.sdc = this.startDateChange.bind(this);
		this.edc = this.endDateChange.bind(this);
	}

	setBase(c) {
		this.setState({
			base: c,
		});
	}

	startDateChange(d) {
		this.setState({
			startDate: d,
		});
	}

	endDateChange(d) {
		this.setState({
			endDate: d,
		});
	}


	render() {
		const selectCurrency = this.state.currencies.map((name) => {
			return (
				<option
				onClick={() => this.setBase(name)}>
						{name}
				</option>
			);
		});
		return (
			<div class="main-graph">
			<ExchangeRateGraph bc={this.state.base} sd={this.state.startDate} ed={this.state.endDate}/>
			<div class="graph-controls">
			<h3>Base currency: </h3>
			<select>{selectCurrency}</select>
			<h3 id="from-label">From: </h3>
			<DatePicker
			  selected={this.state.startDate}
			  onChange={this.sdc}
			  dateFormat="yyyy, d, MM"
			/>
			<h3> to </h3>
			<DatePicker
			  selected={this.state.endDate}
			  onChange={this.edc}
			  dateFormat="yyyy, d, MM"
			/>
			</div>
			</div>
		);
	}
}

export default ExchangeRateBase;
