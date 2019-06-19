import React from 'react';
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types';
import {Typography} from '@material-ui/core';

const styles = () =>({
    root:{
        padding:5
    },
    sideList:{
        backgroundColor:'#fff',
        boxShadow: '0.1rem 0.1rem 0.2rem rgba(0,0,0,0.1);',
        padding:10,
    },
    label:{
        fontSize:20,
        fontWeight:'bold',
        borderBottom:'1px solid rgb(240, 240, 240)'
    },
    row:{
        cursor:'pointer',
        borderBottom:'1px solid rgb(240, 240, 240)',
        '&:hover':{
            backgroundColor:'rgb(245, 245, 245)',
        },
        padding:'10px 0'

    }

});

const SideList = (props) =>{

    const { classes, label, list } = props;

    return(
        <div className={classes.root}>
            <div className={classes.sideList}>
                <Typography variant="body2" className={classes.label}>{label}</Typography>
                {
                    list.map((e,index)=>(
                        <Typography 
                            key={index} 
                            variant="body2"
                            className={classes.row}
                        >
                            {e}
                        </Typography>             
                    ))
                }
            </div>
        </div>
    );
}

SideList.propTypes={
    classes:PropTypes.object.isRequired,
}

export default withStyles(styles)(SideList);