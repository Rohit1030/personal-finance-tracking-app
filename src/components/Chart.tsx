import { LineChart, XAxis, YAxis, Line, Legend, CartesianGrid, Tooltip } from "recharts";
import React from "react";

export default function Chart(props: any){
    return (
        <LineChart width={380} height={230} data={props.data} margin={{top: 0, right:40, bottom: 0, left: 0}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey= 'week' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey='creditAmount' stroke="#8884d8" />
            <Line type="monotone" dataKey='debitAmount' stroke="#82ca9d" />
        </LineChart>
    );
}