import React from "react";
import { Select, Button } from "antd";
import 'antd/dist/antd.css';
import "./Visualization.css";
import { EyeOutlined } from '@ant-design/icons'
import Chart from "./Chart";

const { Option } = Select;

export default function Visualization(){
    type monthType = any[];
    const [months, setMonths] = React.useState<monthType>([]); 
    var tempMonths: any[] = [];
    const [selectedMonth, setSelectedMonth] = React.useState('');
    const [retrievedData, setRetrievedData] = React.useState<monthType>([]);
    
    React.useEffect(() => {
        const indexedDB = window.indexedDB;
        const request = indexedDB.open('ManageExpenses');
        request.onerror = function () {
            console.error("Error occured while loading data!!!");
        }
        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction('expenses', 'readwrite');
            const store = transaction.objectStore('expenses');
            
            const monthsIndex = store.index('months');
            const monthsQuery = monthsIndex.getAll();
            monthsQuery.onsuccess = function (){
                setMonths([...monthsQuery.result])
            }
        }
    }, []);

    if(months.length !== 0) {
        months.forEach(item => {
            if(!tempMonths.includes(item.month)){
                tempMonths.push(item.month);
            }
        });
    }

    const monthOptions = [];
    for(let i = 0; i < tempMonths.length; i++){
        let currentOption = tempMonths[i][0].toUpperCase() + tempMonths[i].substring(1);
        monthOptions.push(<Option key={i} value={tempMonths[i]}>{currentOption}</Option>)
    }

    function handleSelect(value: string){
        setSelectedMonth(value);
    }

    function handleClick (){
        const indexedDB = window.indexedDB;
        const request = indexedDB.open('ManageExpenses');
        request.onerror = function () {
            console.error("Error occured while loading data!!!");
        }
        request.onsuccess = function () {
            const db = request.result;
            const transaction = db.transaction('expenses', 'readwrite');
            const store = transaction.objectStore('expenses');
            
            const monthsIndex = store.index('months');
            const monthsQuery = monthsIndex.getAll([selectedMonth]);
            monthsQuery.onsuccess = function (){
                const changedData = weekData(monthsQuery.result);
                console.log(changedData);
                setRetrievedData(changedData);
            }
        }
    }

    function weekData(data: any){
        const weekArray = [
            {
                week: 'Week 1',
                creditAmount: 0,
                debitAmount: 0
            },
            {
                week: 'Week 2',
                creditAmount: 0,
                debitAmount: 0
            },
            {
                week: 'Week 3',
                creditAmount: 0,
                debitAmount: 0
            },
            {
                week: 'Week 4',
                creditAmount: 0,
                debitAmount: 0
            }
        ];

        if(selectedMonth !== 'february'){
            weekArray.push(
                {
                    week: 'Week 5',
                    creditAmount: 0,
                    debitAmount: 0
                }
            );

        }

        for(let i=0; i < data.length; i++){
            if(data[i].date <= 7){
                if(data[i].type === 'credit'){
                    weekArray[0].creditAmount = weekArray[0].creditAmount + data[i].amount;
                }
                else {
                    weekArray[0].debitAmount = weekArray[0].debitAmount + data[i].amount;
                }
            }
            else if(7 < data[i].date && data[i].date <= 14){
                if(data[i].type === 'credit'){
                    weekArray[1].creditAmount = weekArray[1].creditAmount + data[i].amount;
                }
                else {
                    weekArray[1].debitAmount = weekArray[1].debitAmount + data[i].amount;
                }
            }
            else if(14 < data[i].date && data[i].date <= 21){
                if(data[i].type === 'credit'){
                    weekArray[2].creditAmount = weekArray[2].creditAmount + data[i].amount;
                }
                else {
                    weekArray[2].debitAmount = weekArray[2].debitAmount + data[i].amount;
                }
            }
            else if (21 < data[i].date && data[i].date <= 28){
                if(data[i].type === 'credit'){
                    weekArray[3].creditAmount = weekArray[3].creditAmount + data[i].amount;
                }
                else {
                    weekArray[3].debitAmount = weekArray[3].debitAmount + data[i].amount;
                }
            }
            else if (28 < data[i].date){
                if(data[i].type === 'credit'){
                    weekArray[4].creditAmount = weekArray[4].creditAmount + data[i].amount;
                }
                else {
                    weekArray[4].debitAmount = weekArray[4].debitAmount + data[i].amount;
                }
            }
        }

        return weekArray;
    }

    return (
        <div className="container-visualize">
            <div className="option-n-btn">
            <Select 
                className="visualization-select"
                placeholder='Month'
                onSelect={handleSelect}
            >
                {monthOptions}
            </Select>
            <Button 
                type="primary" 
                size="small" 
                icon={<EyeOutlined />}
                onClick={handleClick}
                disabled={!selectedMonth ? true : false}
            >
                SHOW
            </Button>
            </div>
            {retrievedData.length !==0 && <Chart data={retrievedData} />}
        </div>
    );
}