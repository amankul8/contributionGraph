import styles from "./box.module.css";
import React, { useState } from "react";
import cn from 'classnames';
import format from "date-fns/format";
import { ru } from 'date-fns/locale';

export const  Box = ({contributions, date=''})=>{

    const [selected, setSelected] = useState(false);

    const selecthandler = ()=>{
        setSelected(!selected);
    }

    return(
            <div className={cn(styles.wrapper,{
                    [styles.selected]: selected,
                    [styles.bg2]: contributions >=1 && contributions<=9,
                    [styles.bg3]: contributions >=10 && contributions<=19,
                    [styles.bg4]: contributions >=20 && contributions<=29,
                    [styles.bg5]: contributions >=30
                })} 
                onClick={selecthandler}
            >
                {
                    selected?
                    <div className={styles.tooltip}>
                        <span className={styles.contribution}>{
                            date===''? contributions===0?`${contributions} contributions`:
                            `${contributions} - ${contributions+10} contributions`:
                            `${contributions} contributions`
                        }</span>
                        <span className={styles.date}> {
                            date===''?
                            '':
                            format(new Date(date), 'eeee, MMMM dd yyyy', { locale: ru })
                        } </span>
                    </div>:
                    ''
                }
            </div>    
        )
} 