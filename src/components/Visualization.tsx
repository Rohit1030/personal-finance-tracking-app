import React from "react";

export default function Visualization(){
    type monthType = string[]
    const [months, setMonths] = React.useState<monthType>([]); 
    
    React.useEffect(() => {
        const indexedDB = window.indexedDB;
        const request = indexedDB.open('ManageExpenses');
        request.onerror = function () {
            console.error("Error occured while loading data!!!");
        }
        request.onsuccess = function () {
            var tempMonths: any[] = [];
            const db = request.result;
            const transaction = db.transaction('expenses', 'readwrite');
            const store = transaction.objectStore('expenses');
            const storeCursor= store.openCursor();
            storeCursor.onsuccess = function (){
                var cursor = storeCursor.result;
                if(cursor){
                    if(!tempMonths.includes(cursor.value.month)){
                        tempMonths.push(cursor.value.month);
                    }
                    cursor.continue();
                }
                else {
                    console.log('no more entries');
                }
                setMonths([...tempMonths]);
            }
            const monthsIndex = store.index('months');
            // below code can be used to fetch data for a single month
            const monthsQuery = monthsIndex.getAll(['january']);
            monthsQuery.onsuccess = function (){
                console.log('Requested: ', monthsQuery.result);
            }
        }
    }, []);
    return (
        <div>
            {months}
        </div>
    );
}