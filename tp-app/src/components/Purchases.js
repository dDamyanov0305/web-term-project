import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import {red,green,amber,purple} from '@material-ui/core/colors';
import {root} from '../config/css';
import status from '../config/Status';
import CTable from './CTable';
import '../config/style.css';

const styles=()=>({
    root,
    image:{
        width:100,
    },
    status1:{
        color:red[500]
    },
    status2:{
        color:green[500]
    },
    status3:{
        color:amber[600]
    },
    status4:{
        color:purple[900]
    }
    
});


const Purchases = props =>{

    const { classes, items } = props;

    return(
        <CTable name="Purchases" fields={["book","title","uploader email","status"]} items={items}>
            {
                items.map((e,index)=>(
                    <TableRow key={index} className="row" onClick={()=>{props.history.push('/b/'+e.item.id)}}>
                        <TableCell>
                            <img src={e.item.image} alt="cover" className={classes.image}/>
                        </TableCell>
                        <TableCell>
                            <Typography variant='overline'>
                                {e.item.title}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant='overline'>
                                {e.owner.email}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant='overline' className={classes["status"+e.status]}>
                                {status[e.status]}
                            </Typography>
                        </TableCell>
                    </TableRow>
                ))
            }
        </CTable>
    );

}

Purchases.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Purchases);
