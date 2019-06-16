import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import TableCell from '@material-ui/core/TableCell';
import THead from './THead';
import Paper from '@material-ui/core/Paper';
import { root } from '../config/css';

const styles = () =>({
    root:{
        overflow:'auto',
        padding:10
    },
    type:{
        color:'#bdbdbd'
    },
    

});


const CTable = props =>{

    const { classes } = props;

    return(
        <div className={classes.root}>
           <Typography variant='h6' className={classes.type} gutterBottom>{props.name}</Typography>
            <Paper style={{overflow:'auto',}}>
                <Table>
                    <THead fields={props.fields}/>
                    <TableBody>
                        {
                            props.items.length!=0?
                            props.children:
                            <TableCell colSpan={props.fields.length}>
                                <Typography variant='body2' align="center" style={{fontSize:25,color:'#bdbdbd',fontFamily: 'Roboto', padding:'50px 0'}}>nothing to show</Typography>
                            </TableCell>
                        }
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}

CTable.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(CTable);
