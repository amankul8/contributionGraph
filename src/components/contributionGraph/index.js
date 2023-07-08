import React, { useEffect, useState } from "react";
import styles from "./ContributionGraph.module.css";
import { Box } from "../../ui";
import {format, sub, compareAsc, addMonths, startOfMonth, addDays, setDay, endOfWeek} from "date-fns";
import axios from 'axios';
import { ru } from 'date-fns/locale';

export const CotributionGraph =()=>{

    const FORMAT = "yyyy MM dd";
    const endDate = new Date();
    const startDate = sub(endDate, {weeks: 50});
    const [isLoad, setIsLoad] = useState(true);

    const [dates, setDates] = useState([]);
    
    useEffect(()=>{
        if(dates.length===0){
            getDatesByApi();
        }
    }, [])

    const getDatesByApi = ()=>{
        setIsLoad(true);
        axios.get('https://dpg.gg/test/calendar.json')
        .then(res=>{
            setDates(res.data);
        })
        .catch(err=>{
            console.log(err.message);
        })
        .finally(()=>{
            setIsLoad(false);
        })
    }

    const getMonthList = ()=>{
        let date = startOfMonth(startDate);
        let months = [];
        while(compareAsc(date, endDate)===-1){
            let name = format(date, 'MMMM', {locale: ru})
            months.push(name.charAt(0).toUpperCase() + name.slice(1));
            
            date = addMonths(date, 1);
        }
        return months;
    }

    const getDays = ()=>{
        let days = [];
        let sDay = setDay(startDate, 1)
        let eDay = endOfWeek(endDate, { weekStartsOn: 1 });
        for(let date = sDay; compareAsc(date, eDay)===-1; date = addDays(date, 1)){
            days.push(date);
        }
        return days;
    }

    const getDaysByWeek = ()=>{
        let daysByWeek = [];
        let weekDays = [];

        for(let i=0; i < getDays().length / 7; i++){
            for(let j=i*7; j<i*7+7; j++){
                weekDays.push(format(getDays()[j], 'yyyy-MM-dd'));
            }
            daysByWeek.push(weekDays);
            weekDays = [];
        }
        return daysByWeek;
    }

    return(
        <div className={styles.wrapper}>
           {
                isLoad?
                    "Загрузка ...":
                <div className={styles.graph}>
                    <div className={styles.header}>
                        {
                            getMonthList().map(item=>{
                                return(
                                    <span className={styles.monthName}>
                                        {item}
                                    </span>
                                )
                            })
                        }
                    </div>
                    <div className={styles.row}>
                        <div className={styles.colomn}>
                            <span className={styles.weekday}>Пн</span>
                            <span className={styles.weekday}>Вт</span>
                            <span className={styles.weekday}>Ср</span>
                            <span className={styles.weekday}>Чт</span>
                            <span className={styles.weekday}>Пт</span>
                            <span className={styles.weekday}>Сб</span>
                            <span className={styles.weekday}>Вс</span>
                        </div>
                        {
                            getDaysByWeek().map(item=>{
                                return(
                                    <div className={styles.colomn}>
                                        {
                                            item.map(date=>{
                                                return(
                                                    typeof dates[date] !==  'undefined'?
                                                    <Box contributions={dates[date]} date={date}/>:
                                                    <Box contributions={0} date={date}/>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={styles.infoBlock}>
                        <span>Меньше</span>
                        <Box contributions={0}/>
                        <Box contributions={5}/>
                        <Box contributions={15}/>
                        <Box contributions={25}/>
                        <Box contributions={35}/>
                        <span>Больше</span>
                    </div>
                </div>
           }
        </div>
    )
}