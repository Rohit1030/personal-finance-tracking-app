import React from 'react';
import { FormOutlined, BarChartOutlined } from '@ant-design/icons';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import DataEntry from './components/DataEntry';
import Visualization  from './components/Visualization';
import './App.css';

function App() {
  React.useEffect(() => {
    const IndexedDB = window.indexedDB;
    const request = IndexedDB.open('ManageExpenses', 1);
    request.onerror = function (event) {
      console.error("An error occured with IndexedDB");
    }
    request.onupgradeneeded = function(){
      const db = request.result;
      const store = db.createObjectStore('expenses', { keyPath: 'id' });
      store.createIndex('months', ['month'], { unique: false });
    }
  }, []);
  return (
    <BrowserRouter>
      <div className="App">
        <header><h2>TRACK YOUR EXPENSES</h2></header>
        <div className="pages">
          <Link to='/'>
            <span className='link-text'>Add Funds</span>
            <FormOutlined />
          </Link>
          <Link to='/visualization'>
            <span className='link-text'>Expenses</span>
            <BarChartOutlined />
          </Link>
        </div>
      </div>
      <Routes>
        <Route path='/' element={<DataEntry />} />
        <Route path='/visualization' element={<Visualization />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
