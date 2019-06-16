import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography, Button, IconButton } from '@material-ui/core';
import Clear from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import Settings from '@material-ui/icons/Settings';
import {root} from '../config/css';
import CTable from './CTable';
import { db } from '../config/FirebaseConfig';
import '../config/style.css'

const styles=()=>({
    root,
    image:{
        width:100,
    },

});


const Uploads = props =>{

    const { classes, items } = props;

    const withdraw = (item) =>{
        if(item.available)
        db.collection('books').doc(item.id).delete();
    }

    return(
        <CTable name="Uploads" fields={["book","title","upload date","status",""]} items={items}>
            {
                items.map((item,index)=>(
                    <TableRow key={index} className="row" onClick={()=>{props.history.push('/b/'+item.id)}}>
                        <TableCell><img src={item.image} alt="cover" className={classes.image}/></TableCell>
                        <TableCell>
                            <Typography variant='overline'>
                                {item.title}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant='overline'>
                                
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant='overline'>
                                {item.available?"In store":"Sold"}
                            </Typography>
                        </TableCell>
                        <TableCell style={{width:100}} align="left">
                            <Tooltip title='edit'>
                                <IconButton className="last" color='inherit' onClick={()=>{props.history.push('/e/'+item.id)}}>
                                    <Settings/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='withdraw'>
                                <IconButton className="last" color='inherit' onClick={()=>{withdraw(item.id)}}>
                                    <Clear/>
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                ))
            }
        </CTable>
    );
}

Uploads.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Uploads);
