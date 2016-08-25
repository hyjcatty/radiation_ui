/**
 * Created by hyj on 2016/8/16.
 */

import React, {
    Component,
    PropTypes
    } from 'react';

import '../../css/font-awesome.min.css';
import '../../css/bootstrap.min.css';
import './custom2.css';
import classNames from 'classnames';

export default class Sport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current:0, // current
            count:0, // count
            average:0, // current average
            last_average:0,
            percent:"0%",
            alarm:200,
            warning:100,
            history:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] ,//daily history,

            color_current:"count green",
            color_average:"count green",
            chart_height_1:"200px",
            chart_height_2:"100px"
        };
        this.style = {
        }
    }
    updatealarm(warning,alarm){
        this.setState({alarm:alarm,warning:warning})
    }
    updatehight(chart_height){
        this.setState({chart_height_1:parseInt(chart_height *1.5)+"px",chart_height_2:parseInt(chart_height)+"px;padding:10px 25px"})
    }
    updatecurrent(current){
        let percent = 100;
        if(current==this.state.current) percent=0;
        if(0!==this.state.current) {percent =parseInt((current-this.state.current)/this.state.current*100);}
        let average = parseInt((this.state.average)/(this.state.count+1)*(this.state.count)+current/(this.state.count+1));
        //this.state.current = current;
        //this.state.average = average.toString+"%";
        let count=parseInt(this.state.count)+1;
        //this.state.percent = percent;
        let color_current;
        if(current >= this.state.alarm){
            color_current = "count red";
        }else if(current >= this.state.warning){
            color_current = "count orange";
        }else{
            color_current = "count green";
        }
        var color_average;
        if(average >= this.state.alarm){
            color_average = "count red";
        }else if(this.state.average >= this.state.warning){
            color_average = "count orange";
        }else{
            color_average = "count green";
        }

        this.setState({current:current,percent:percent.toString()+"%",count:count,average:average,color_current:color_current,color_average:color_average})
    }
    updatehistory(history){
        this.state.history = history;
    }

    render() {
        //var Icon = require('react-font-awesome').Icon;
        return (
            <div>
                <div className="row" id="Panel1">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="x_panel" >
                            <div className="col-md-6 col-sm-6 col-xs-6 tile_stats_count">
                                <span className="count_top"><i className="fa fa-user"></i> Current Value</span>
                                <div className={this.state.color_current} id="current_value">{this.state.current}</div>
                                <span className="count_bottom"><i id="audit_percent">{this.state.percent} </i>From last result</span>
                            </div>
                            <div className="col-md-6 col-sm-6 col-xs-6 tile_stats_count" >
                                <span className="count_top"><i className="fa fa-clock-o"></i> Average Value</span>
                                <div className={this.state.color_average} id="average_value">{this.state.average}</div>
                                <span className="count_bottom"><i id="audit_counts">{this.state.count} </i> times account</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" id="Panel2">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="x_panel">
                            <div className="x_title">
                                <h2>Dynamic Charts <small>real time process</small></h2>
                                <div className="clearfix"></div>
                            </div>
                            <div className="x_content">
                                <div>
                                    <div className="demo-container" style={{minHeight:this.state.chart_height_1}}>
                                        <div id="placeholder33x" className="demo-placeholder" style={{minHeight:this.style.chart_height_1}}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" id="Panel3">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="x_panel">
                            <div className="x_title">
                                <h2>Daily Summary <small>statistics by hour</small></h2>
                                <div className="clearfix"></div>
                            </div>
                            <div className="x_content">
                                <div className="row" style={{borderBottom:'1px, solid #E0E0E0',paddingBottom:'5px',marginBottom:'5px'}}>
                                    <div style={{overflow:'hidden'}}>
                            <span id="sparkline_one" style={{minHeight:this.state.chart_height_2}}>
                                <canvas width="200" height="60" style={{display:'inline-block',verticalAlign:'top',width:'94px',height:'30px'}}>

                                </canvas>
                            </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="x_panel">
                            <div className="hyj_footer" id="footer" style={{float:'right'}}>Copy right to hyj</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
