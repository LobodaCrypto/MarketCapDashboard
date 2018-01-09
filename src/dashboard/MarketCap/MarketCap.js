import React, { Component } from 'react';
import './MarketCap.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './react-bootstrap-table-all.min.css';
import * as request from "request-promise-native"
import * as numeral from 'numeral';
import Navbar from '../Navbar'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import randomId from '../helper'

const GRID_SIZE = 12;
const WIDGET_WIDTH = 4;

export default class MarketCap extends Component {

    constructor() {
        super();

        this.state = {
            coinData: []
        };
    }

    componentDidMount() {

        let options = {
            url: 'https://api.coinmarketcap.com/v1/ticker/?limit=100',
            json: true,
            headers: {
                'origin': 'null'
            }
        };
        request(options).then(response => {

            let coinData = response.map(coinDatum => {
                coinDatum['rank'] = parseInt(coinDatum['rank'], 10);
                coinDatum['market_cap_usd'] = parseInt(coinDatum['market_cap_usd'], 10);
                coinDatum['price_usd'] = parseFloat(coinDatum['price_usd'], 10);
                coinDatum['24h_volume_usd'] = parseFloat(coinDatum['24h_volume_usd'], 10);
                coinDatum['total_supply'] = parseFloat(coinDatum['total_supply'], 10);
                coinDatum['percent_change_1h'] = parseFloat(coinDatum['percent_change_1h'], 10);
                coinDatum['percent_change_24h'] = parseFloat(coinDatum['percent_change_24h'], 10);
                coinDatum['percent_change_7d'] = parseFloat(coinDatum['percent_change_7d'], 10);
                return coinDatum;
            });

            this.setState({ coinData });

        }).catch(err => {
            console.error(err)
        });
    }

    formatIcon(cell, row) {

        let currency = cell.toLowerCase().replace(/\s+/g, '-');
        let translations = {
            'bytecoin': 'bytecoin-bcn',
            'golem': 'golem-network-tokens',
            'byteball-bytes': 'byteball',
            'stellar-lumens': 'stellar',
            'metaverse-etp': 'metaverse',
            'atmchain': 'attention-token-of-media',
            'gnosis': 'gnosis-gno',
            'i/o-coin': 'iocoin',
            'adex': 'adx-net',
            'iexec-rlc': 'rlc'
        };

        if (currency in translations) {
            currency = translations[currency];
        }

        return '<div class="s-s-' + currency + ' currency-logo-sprite"></div>';
    }

    formatUSD(cell, row) {
        return '$' + numeral(cell).format('0,0');
    }

    formatPrice(cell, row) {
        return '$' + numeral(cell).format('0.00');
    }

    formatVolume(cell, row) {
        return '$' + numeral(cell).format('0,0');
    }

    formatCirculatingSupply(cell, row) {
        return numeral(cell).format('0,0') + ' ' + row['symbol'];
    }

    formatChange(cell, row) {

        let value = numeral(cell).format('0.0') + '%';

        if (cell >= 0) {
            return '<span style="color:green;">' + value + '</span>';
        } else {
            return '<span style="color:red;">' + value + '</span>';
        }
    }

    render() {
        return(
            <div className="things-box">
                <Navbar _handleOpenModal={this._handleOpenModal.bind(this)}
                        auth={this.props.auth}/>
                <div className="content">
                    <BootstrapTable data={this.state.coinData} striped={true} hover={true} bordered={false} ref="coinTable">
                        <TableHeaderColumn dataField="rank" isKey={true} dataAlign="center" dataSort={true}>Rank</TableHeaderColumn>
                        <TableHeaderColumn dataField="symbol" dataSort={true}>Symbol</TableHeaderColumn>
                        <TableHeaderColumn dataField="name" dataFormat={this.formatIcon} width="2em">&nbsp;</TableHeaderColumn>
                        <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="market_cap_usd" dataFormat={this.formatUSD} dataSort={true}>Market Cap</TableHeaderColumn>
                        <TableHeaderColumn dataField="price_usd" dataFormat={this.formatPrice} dataSort={true}>Price</TableHeaderColumn>
                        <TableHeaderColumn dataField="24h_volume_usd" dataFormat={this.formatVolume} dataSort={true}>Volume</TableHeaderColumn>
                        <TableHeaderColumn dataField="total_supply" dataFormat={this.formatCirculatingSupply} dataSort={true}>Circulating Supply</TableHeaderColumn>
                        <TableHeaderColumn dataField="percent_change_1h" dataFormat={this.formatChange} dataAlign="center" dataSort={true}>Change (1h)</TableHeaderColumn>
                        <TableHeaderColumn dataField="percent_change_24h" dataFormat={this.formatChange} dataAlign="center" dataSort={true}>Change (24h)</TableHeaderColumn>
                        <TableHeaderColumn dataField="percent_change_7d" dataFormat={this.formatChange} dataAlign="center" dataSort={true}>Change (7d)</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>

        );
    }

    _addWidget(options){
        const widget = {
            type: options.type,
            crypto: options.crypto,
            key: randomId(),
            x: (this.state.grid.length * WIDGET_WIDTH) % GRID_SIZE,
            width: options.width
        }

        this._saveGridState(this.state.grid.concat(widget))
    }

    _handleOpenModal() {
        this.setState({ showModal: true });
    }

    _handleCloseModal (e) {
        this.setState({ showModal: false });
    }

    _saveGridState(grid_state){
        this.setState({grid : grid_state})
        var options = {
            method: 'POST',
            url: 'https://swmllargy4.execute-api.us-east-1.amazonaws.com/prod/auth0proxy_auth0proxy',
            headers:
                {
                    'content-type': 'application/json',
                },
            body: { user_id: this.state.profile.sub, grid: grid_state},
            json: true
        };
        request(options)
    }
}

