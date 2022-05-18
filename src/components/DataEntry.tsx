import React from 'react';
import { Select, Button, Input } from 'antd';
import 'antd/dist/antd.css';
import "./DataEntry.css";
import { PlusCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { Option } = Select;

export default function DataEntry(){
    var LocalStorage: any;
    var index: number
    type datatype = {
        id: number;
        month: string;
        date: number;
        type: string;
        amounts: Array<number>;
        count: number;
        errorObjects: any;
        isDisabledError: {
            isDateDisabled: boolean;
            isTypeDisabled: boolean;
            isAddButtonDisabled: boolean;
        };
    }
    const amountRegex = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/;
    const [data, setData] = React.useState<datatype>(
        {
            id: 0,
            month: '',
            date: 0,
            type: '',
            amounts: [],
            count: 0,
            errorObjects: [],
            isDisabledError: {
                isDateDisabled: true,
                isTypeDisabled: true,
                isAddButtonDisabled: true,
            }
        }
    );
    const months = [
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december'
    ];
    const monthChildren = [];
    for (let i = 0; i < 12; i++) {
        let monthOption = months[i][0].toUpperCase() + months[i].substring(1);
        monthChildren.push(<Option key={i} value={months[i]}>{monthOption}</Option>);
    }

    let lastDate: number;
    const dateChildren = [];
    if(data.month !== ''){
        switch(data.month){
            case 'february':
                lastDate = 28;
                break;
            case 'april':
            case 'june':
            case 'september':
            case 'november':
                lastDate = 30;
                break;
            default:
                lastDate = 31;
        }
        for(let i = 1; i <= lastDate; i++){
            dateChildren.push(
                <Option 
                    key={i} 
                    value={i}>
                        {i< 10 ? '0' + i : i}
                </Option>
            );
        }
    }

    const amountEntryArray = [];
    if(data.count !== 0 ){
        for(let i=0; i<data.count; i++){
            amountEntryArray.push(
                <Input 
                    key={i}
                    id={i.toString()}
                    type='text'
                    className='input-amount'
                    onChange={handleAmount}
                    suffix={data.errorObjects[i].isError ? <ExclamationCircleOutlined /> : <span />}
                    status={data.errorObjects[i].isError ? 'error':''}
                >
                </Input>
            )
        }
    }
      
    function handleMonthChange(value: string) {
        setData(prevData => {
            return {
                ...data,
                month: value,
                isDisabledError: {
                    ...prevData.isDisabledError,
                    isDateDisabled: false
                }
            }
        }); 
    }

    function handleTypeChange(value: string) {
        setData(prevData => {
            return {
                ...data,
                type: value,
                isDisabledError: {
                    ...prevData.isDisabledError,
                    isAddButtonDisabled: false
                }
            }
        });
    }

    function handleDateChange(value: number) {
        setData(prevData => {
            return {
                ...data,
                date: value,
                isDisabledError: {
                    ...prevData.isDisabledError,
                    isTypeDisabled: false
                }
            }
        });
    }

    function handleSubmit(event: any){
        event.preventDefault();
        const IndexedDB = window.indexedDB;
        const request = IndexedDB.open('ManageExpenses', 1);
        request.onerror = function (event) {
            console.error("An error occured with IndexedDB");
        }
        
        request.onsuccess = function(){
            const db = request.result;
            const transaction = db.transaction('expenses', 'readwrite');
            const store = transaction.objectStore('expenses');
            store.put({
                id: data.id,
                month: data.month,
                date: data.date,
                type: data.type,
                amounts: data.amounts,
            });
            const nextValue = data.id + 1;
            localStorage.setItem('index', JSON.stringify(nextValue));
            setData(prevData => {
                return {
                    ...prevData,
                    id: prevData.id + 1
                }
            })
        }
    }

    function handleNumberOfEntries(){
        setData(prevData => {
            return {
                ...prevData,
                count: prevData.count + 1,
                errorObjects: [
                    ...prevData.errorObjects,
                    {
                        isError: false
                    }
                ]
            }
        });
    }

    function handleAmount(event: any){
        let tempErrorArray = data.errorObjects;
        if(amountRegex.test(event.target.value)){
            let tempArray = data.amounts;
            tempArray[parseInt(event.target.id)] = parseFloat(event.target.value);
            tempErrorArray[parseInt(event.target.id)] = {
                isError: false
            };
            setData(prevData => {
                return {
                    ...prevData,
                    amounts: tempArray,
                    errorObjects: tempErrorArray
                }
            });
        }
        else {
            tempErrorArray[parseInt(event.target.id)] = {
                isError: true
            };
            setData(prevData => {
                return {
                    ...prevData,
                    errorObjects: tempErrorArray
                }
            })
        }
    }

    React.useEffect(() => {
        LocalStorage= localStorage.getItem('index');
        if(LocalStorage !== null){
            index = parseInt(LocalStorage);
        }
        else {
            index = 0;
            localStorage.setItem('index', JSON.stringify(index));
        }
        setData(prevData => {
            return {
                ...prevData,
                id: index
            }
        });
    }, [data.id]);
    return (
        <>
            <form className='form' onSubmit={handleSubmit}>
                <Select 
                    placeholder="Select month" 
                    onChange={handleMonthChange}
                    className='select'
                >
                        {monthChildren}
                </Select>
                <Select 
                    placeholder="Select date" 
                    onChange={handleDateChange}
                    disabled={data.isDisabledError.isDateDisabled}
                    className='select'
                >
                        {dateChildren}
                </Select>
                <Select
                    placeholder='Expense Type'
                    onChange={handleTypeChange}
                    disabled={data.isDisabledError.isTypeDisabled}
                    className='select'
                >
                    <Option key='credit' value='credit'>Credit</Option>
                    <Option key='Debit' value='debit'>Debit</Option>
                </Select>
                <Button 
                    type='primary' 
                    icon={<PlusCircleOutlined />} 
                    size='middle'
                    className='add-expense-btn' 
                    disabled={data.isDisabledError.isAddButtonDisabled}
                    onClick={handleNumberOfEntries}
                >
                    Add amounts
                </Button>
                {
                    data.count !==0 && 
                    <div>
                        <h4>AMOUNTS</h4>
                        <Input.Group className='input-group'>
                            {amountEntryArray}
                        </Input.Group>
                    </div>
                }
                {data.count !==0 && <button className='submit-btn'>Save</button>}
            </form>
        </>
    );
}