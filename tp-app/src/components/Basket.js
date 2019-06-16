import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Clear from '@material-ui/icons/Clear';
import { Typography, Button, IconButton } from '@material-ui/core';
import {root} from '../config/css';
import CTable from './CTable';

const styles=(theme)=>({
    root,
    image:{
        width:100,
    },
    button:{
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    },
    buttonText:{
        marginLeft:10,
        marginRight:10,
        color:theme.palette.background.paper,
    },
});


const Basket = props =>{

    const { classes, items } = props;
    let total = items.reduce((prev,curr)=>prev+curr,0);
    let discount = 0;

    return(
        <CTable name="Basket" fields={["book","title","author","price"]} items={items}>
            {
                items.map((e,index)=>(
                    <TableRow key={index} className="row" onClick={()=>{props.history.push('/b/'+e.id)}}>
                        <TableCell><img src={e.image} alt="cover" className={classes.image}/></TableCell>
                        <TableCell>
                            <Typography variant='overline'>
                                {e.title}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant='overline'>
                                {e.author}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant='overline' color="secondary">
                                {e.price}
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <IconButton color='inherit' onClick={()=>{props.handleBasketChange(e,"R")}}>
                                <Clear/>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))
            }
            {
                items.length!=0&&<>
                    <TableRow>
                        <TableCell colSpan={2} rowSpan={4}/>
                        <TableCell>
                            <Typography variant='button'>
                                Total worth:
                            </Typography>
                        </TableCell>
                        <TableCell>
                        <Typography variant='button' >
                                {total}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant='button'>
                                Discount:
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant='button' >
                                {discount}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Button className={classes.button} onClick={props.handleFinalize}>
                                <Typography className={classes.buttonText}>
                                    purchase
                                </Typography>
                            </Button>
                        </TableCell>
                        <TableCell>
                            <Typography variant='button' color='secondary'>
                                {total-discount}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </>
            }
        </CTable>
    );
}

Basket.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles,{withTheme:true})(Basket);
