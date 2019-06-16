import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Typography, Button } from '@material-ui/core';
import {red,green} from '@material-ui/core/colors';
import status from '../config/Status';
import {root} from '../config/css';
import CTable from './CTable';

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

    
});

const Requests = (props) => {

    const { classes, items } = props;

    return(
        <CTable name="Requests" fields={["book","title","buyer","status"]} items={items}>
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
                                {e.buyer.email}
                            </Typography>
                        </TableCell>
                            {
                                (e.status===0)?
                                <TableCell>
                                    <Button onClick={()=>{props.acceptRequest(e)}}>
                                        <Typography variant='overline' className={classes.status2}>
                                            Accept
                                        </Typography>
                                    </Button>
                                    <Button onClick={()=>{props.rejectRequest(e)}}>
                                        <Typography variant='overline' className={classes.status1}>
                                            Reject
                                        </Typography>
                                    </Button>
                                </TableCell>:
                                <TableCell>
                                    <Typography variant='overline' >
                                        {status[e.status]}
                                    </Typography>
                                </TableCell>
                            }
                    </TableRow>
                ))
            }      
                    
        </CTable>
    );
    


    
}

Requests.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles,{withTheme:true})(Requests);
