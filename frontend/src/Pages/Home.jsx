import React,{useState, useContext,useEffect} from 'react';
import '../styles/home.css';
import {BASE_URL} from '../Utils/config.js';
import useFetch from '../hooks/useFetch.js';
import {AuthContext} from "../context/AuthContext";
import {Chart as ChartJS} from 'chart.js/auto'
import {Bar,Doughnut} from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AddExpense from '../Components/AddExpense/AddExpense'


const Home = () =>{

    const { user,dispatch } = useContext(AuthContext);//to get user id
    const { data } = useFetch(user ? `${BASE_URL}/user/${user._id}` : null);//call us api. It has all user data


    //to store category selected
    const [selectedCategory, setSelectedCategory] = useState('All');
    const handleCategory = (event) => {
        setSelectedCategory(event.target.value);
    };

    //To store subcategory filters
    const [food,setFood] = useState(false);
    const [housing,setHousing] = useState(false);
    const [utilities,setUtilities] = useState(false);
    const [healthcare,setHealthcare] = useState(false);
    const [entertainment,setEntertainment] = useState(false);
    const [clothing,setClothing] = useState(false);

    //To see if any subcategory is selected
    const [subCategory, setSubCategory] = useState(false);
    useEffect(() => {
        setSubCategory(food || housing || utilities || healthcare || entertainment || clothing);
      }, [food, housing, utilities, healthcare, entertainment, clothing]);

    const handleSubCategory = () => {
        if(subCategory===true){
            setFood(false);
            setHousing(false);
            setUtilities(false);
            setHealthcare(false);
            setEntertainment(false);
            setClothing(false);
            setSubCategory(false);
        }
    };


    //to show addexpense component
    const [addExpense,setAddExpense] = useState(false);
    
    //Grouping and sorting the expenses to display
    const [groupedExpenses, setGroupedExpenses] = useState([]);

    useEffect(() => {
        if (data && data.expenses ) {
          const expensesByDate = data.expenses;
    
          const groupedExpenses = groupExpensesByCommonDate(expensesByDate);
    
          setGroupedExpenses(groupedExpenses);
        }
      }, [data]);
    
      const groupExpensesByCommonDate = (expensesByDate) => {
        const groupedExpenses = Object.values(expensesByDate).reduce((acc, expense) => {
         
          let group = acc.find(g => g.date === expense.date);
          if (!group) {
            group = { date: expense.date, expenses: [] };
            acc.push(group);
          }
    
          
          group.expenses.push(expense);
    
          return acc;
        }, []);
    
        // Sort the grouped expenses by date in descending order
        groupedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    
        return groupedExpenses;
      };

    // Foramtting the dates to display (today yesterday etc)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
    
        if (isSameDay(date, today)) {
          return 'Today';
        } else if (isSameDay(date, yesterday)) {
          return 'Yesterday';
        } else {
          // Format the date as yyyy-mm-dd
          const formattedDate = date.toISOString().split('T')[0];
          return formattedDate;
        }
    };

    const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };

    //calculating montly sum for donut chart (input)
    let monthSum = {
        essential: 0,
        nonessential: 0,
        miscelaneous: 0
    };

    groupedExpenses.forEach(group => {
        group.expenses.forEach(expense => {
          switch (expense.category) {
            case 'Essential':
              monthSum.essential += expense.amount;
              break;
            case 'Non-Essential':
              monthSum.nonessential += expense.amount;
              break;
            case 'Miscelaneous':
              monthSum.miscelaneous += expense.amount;
              break;
          }
        });
    });

    //Calculating weekly expenses for bar chart(input)
    let weeklySums = [];

        // Calculate start and end dates for each day of the week
        for (let i = 0; i < 7; i++) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - i);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        // Find expenses for the current day
        const expensesForDay = groupedExpenses.find(group => {
            const groupDate = new Date(group.date);
            return groupDate >= startDate && groupDate < endDate;
        });

        // Initialize sums for the current day
        let daySum = {
            date: formatDate(startDate), // Format the date as needed
            essential: 0,
            nonessential: 0,
            miscellaneous: 0
        };

        // Calculate sums for the current day if expenses are found
        if (expensesForDay) {
            expensesForDay.expenses.forEach(expense => {
            switch (expense.category) {
                case 'Essential':
                daySum.essential += expense.amount;
                break;
                case 'Non-Essential':
                daySum.nonessential += expense.amount;
                break;
                default:
                daySum.miscellaneous += expense.amount;
                break;
            }
            });
        }

        // Push the day's sum object into the weeklySums array
        weeklySums.push(daySum);
        }


    

    //to get different symbols for different sub categories
    function getSymbolForSubcategory(subcategory) {
        switch (subcategory.toLowerCase()) {
          case 'food':
            return <p className="text-4xl expense_right_section_element_logo">🍲</p>;
          case 'housing':
            return <p className="text-4xl expense_right_section_element_logo">🏠</p>;
          case 'entertainment':
            return <p className="text-4xl expense_right_section_element_logo">🎥</p>;
          case 'utilities':
            return <p className="text-4xl expense_right_section_element_logo">🔧</p>;
          case 'healthcare':
            return <p className="text-4xl expense_right_section_element_logo">⚕️</p>;
          case 'clothing':
            return <p className="text-4xl expense_right_section_element_logo">👕</p>;
          
        }
      }
      

    
return (
    <>
    {
     user?

    <main className="home__main">

        <div className="flex flex-wrap justify-center gap-5 expense__main">
            <div className="flex flex-col gap-10 expense_left_section">
                {/* Donut chart section */}
                <div className="p-5 rounded-2xl bg-white month_expense_section">
                    <p className="font-bold text-lg mb-3">This Month</p>
                    <div className="flex flex-wrap items-center justify-center gap-12">
                        <div className="donut_container">
                            <Doughnut 
                            data={{
                                datasets:[
                                    {
                                        data: [monthSum.essential,monthSum.nonessential,monthSum.miscelaneous],
                                        backgroundColor: ['#27AE60', '#F2C94C', '#BFC5D4'], 
                                        borderWidth: 0,
                                        datalabels: {
                                            color: '#000000',
                                            font: {
                                                size: '12',
                                            },
                                            formatter: (value, context) => {
                                                const dataset = context.chart.data.datasets[context.datasetIndex];
                                                const total = dataset.data.reduce((acc, data) => acc + data, 0);
                                                const percentage = ((value / total) * 100).toFixed(2) + '%';
                                                if (value === 0 || total === 0) {
                                                    return '';
                                                }
                                                return percentage;
                                            }
                                        }                            
                                    }
                                ]
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'top',
                                    }
                                }
                            }} 
                            plugins={[ChartDataLabels]}
                            />
                        </div>

                        <div className="">
                            <div className="flex gap-5 py-1">
                                <div className="h-8 w-8 rounded" style={{backgroundColor:'#27AE60'}}></div>
                                <div>
                                    <p className="font-normal text-xs" style={{color: '#8695B7'}}>Essentials</p>
                                    <p className="font-medium text-base" style={{color: '#607093'}}>₹{monthSum.essential}</p>
                                </div>
                            </div>
                            <div className="flex gap-5 py-1">
                                <div className="h-8 w-8 rounded" style={{backgroundColor:'#F2C94C'}}></div>
                                <div>
                                    <p className="font-normal text-xs" style={{color: '#8695B7'}}>Non-Essentials</p>
                                    <p className="font-medium text-base" style={{color: '#607093'}}>₹{monthSum.nonessential}</p>
                                </div>
                            </div>
                            <div className="flex gap-5 py-1">
                                <div className="h-8 w-8 rounded" style={{backgroundColor:'#BFC5D4'}}></div>
                                <div>
                                    <p className="font-normal text-xs" style={{color: '#8695B7'}}>Miscelaneous</p>
                                    <p className="font-medium text-base" style={{color: '#607093'}}>₹{monthSum.miscelaneous}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    

                </div>

                {/* Bar graph section */}
                <div className="p-5 rounded-2xl bg-white week_expense_section">
                    <p className="font-bold text-lg mb-3">Last Week</p>
                    <Bar 
                        data={{
                            labels: weeklySums.map(day => day.date),
                            datasets:[
                                {
                                    label:"Essentials",
                                    data: weeklySums.map(day => day.essential),
                                    backgroundColor: ['#27AE60'],
                                    order: 1
                                    
                                },
                                {
                                    label:"Non-Essentials",
                                    data: weeklySums.map(day => day.nonessential),
                                    backgroundColor: ['#F2C94C'],
                                    borderRadius: 3,
                                    order: 2
                                }
                            ]
                        }}
                        options={{
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                datalabels: {
                                    display: true,
                                    color: 'black',
                                    font: {
                                        size: 10,
                                    },
                                    offset: -28, 
                                    align: 'top',
                                    anchor: 'end',
                                    formatter: function(value, context) {
                                        if (value === 0) {
                                            return '';
                                        } else {
                                            return '₹' + value;
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    stacked: true,// making the bars stacked
                                    grid: {
                                        display: false // disable vertical grid lines
                                    },
                                    ticks: {
                                        font: {
                                            size: 10 
                                        },
                                        color: '#94A3B8'
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    stacked: true, 
                                    grid: {
                                        color: 'rgba(0, 0, 0, 0.25)',
                                        lineWidth: 0.5
                                    },
                                    ticks: {
                                        font: {
                                            size: 10 
                                        },
                                        color: '#94A3B8',
                                        callback: function(value, index, values) {
                                            return '₹' + value; 
                                        },
                                        stepSize: 250
                                    }
                                }
                            }
                        }}
                        width={400}
                        height={400}
                        plugins={[ChartDataLabels]}
                    />

                </div>

            </div>
            
            {/* View all expenses (right) section */}
            <div className="p-5 rounded-2xl bg-white expense_right_section">
                <div className="flex justify-between mb-2 expense_right_section_top">
                    <p className="text-lg font-bold">Transactions</p>

                    <select value={selectedCategory} onChange={handleCategory} className="text-sm font-normal cursor-pointer rounded-md">
                        <option value="All">All</option>
                        <option value="Essential">Essential</option>
                        <option value="Non-Essential">Non-Essential</option>
                        <option value="Miscelaneous">Miscelaneous</option>
                    </select>
                </div>

                <div className="flex flex-wrap gap-2 mb-5 subcat_filters">
                    <button onClick={handleSubCategory} style={{backgroundColor: subCategory?'#fff':'#005FE4',color: subCategory?'#000000':'#fff'}}>All</button>
                    <button onClick={()=>{setFood(!food)}} style={{backgroundColor: food?'#005FE4':'#fff',color: food?'#fff':'#000000'}}>Food</button>
                    <button onClick={()=>{setHousing(!housing)}} style={{backgroundColor: housing?'#005FE4':'#fff',color: housing?'#fff':'#000000'}}>Housing</button>
                    <button onClick={()=>{setUtilities(!utilities)}} style={{backgroundColor: utilities?'#005FE4':'#fff',color: utilities?'#fff':'#000000'}}>Utilities</button>
                    <button onClick={()=>{setHealthcare(!healthcare)}} style={{backgroundColor: healthcare?'#005FE4':'#fff',color: healthcare?'#fff':'#000000'}}>Healthcare</button>
                    <button onClick={()=>{setEntertainment(!entertainment)}} style={{backgroundColor: entertainment?'#005FE4':'#fff',color: entertainment?'#fff':'#000000'}}>Entertainment</button>
                    <button onClick={()=>{setClothing(!clothing)}} style={{backgroundColor: clothing?'#005FE4':'#fff',color: clothing?'#fff':'#000000'}}>Clothing</button>
                </div>

                <div className="expense_right_section_main">
                    
                {groupedExpenses.map(group => (
                <div key={group.date}>
                    {group.expenses.some(expense =>
                        ((selectedCategory==='All' || (selectedCategory===expense.category)) && (!subCategory || ((food && expense.subcategory==="Food")||(utilities && expense.subcategory==="Utilities")||(healthcare && expense.subcategory==="Healthcare")||(housing && expense.subcategory==="Housing")||(entertainment && expense.subcategory==="Entertainment")||(clothing && expense.subcategory==="Clothing"))) 
                        )
                        ) ? 
                        <div className="font-normal text-sm py-2 expense_right_section_element_title" style={{ color: '#707070' }}>
                           <p>{formatDate(group.date)}</p>
                        </div>
                        : (
                        <></>
                    )}
                    
                   {
                    group.expenses.map(expense => (
                        (selectedCategory==='All' || (selectedCategory===expense.category)) && (!subCategory || ((food && expense.subcategory==="Food")||(utilities && expense.subcategory==="Utilities")||(healthcare && expense.subcategory==="Healthcare")||(housing && expense.subcategory==="Housing")||(entertainment && expense.subcategory==="Entertainment")||(clothing && expense.subcategory==="Clothing"))) ?
                        <div key={expense._id} className="flex items-center gap-2 py-2 expense_right_section_element">
                            {getSymbolForSubcategory(expense.subcategory)}
                            <div className="w-full flex items-center justify-between expense_right_section_element_right">
                            <div>
                                <p className="text-base font-medium">{expense.title}</p>
                                <p className="text-xs font-normal" style={{ color: '#707070' }}>{expense.category} - {expense.subcategory}</p>
                            </div>
                            <p className="text-base font-normal" style={{ color: '#707070' }}>- ₹{expense.amount}</p>
                            </div>
                        </div>
                        :
                        null
                    ))
                    }

                </div>
                ))}                
                </div>

            </div>
        </div>

        <div className="p-5 add_expense_section">
            <button className="h-12 w-12 rounded-3xl flex items-center justify-center text-white" onClick={()=>{setAddExpense(true)}}><i class="ri-add-large-line"></i></button>
        </div>

        {/* Add expense button section */}
        {
            addExpense?
            <div className="flex items-center justify-center add_expense_container"><AddExpense setAddExpense={setAddExpense}/></div>
            :
            <></>
        }
        
    </main>
    :
    <div className="flex flex-col justify-center items-center no_login">
        <p className="">Please Login!!</p>
        <i class="ri-signpost-fill"></i>
    </div>
    }
    </>
);
};

export default Home;