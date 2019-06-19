import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types';
import Item from './Item';
import {Typography, Grid} from '@material-ui/core';

const styles = () =>({
    root:{
        backgroundColor: '#fff',
        boxShadow: '0.1rem 0.1rem 0.2rem rgba(0,0,0,0.1);',
        padding:10
    }
})


const BookSegment = props =>{
    
    const {classes,items,label,...rest}=props;

    return(
        <Grid item xs={12} style={{padding:5}}>
            <div className={classes.root}>
                <Typography variant="body2" style={{fontSize:20,fontWeight:'bold',borderBottom:'1px solid rgb(240, 240, 240)'}}>{label}</Typography>
                {items.length!=0?
                    <>
                        {   
                            items.map((item,index)=>(
                                <Item key={index} item={item} {...rest}/>
                            ))
                        }
                    </>:
                    <Typography variant='body2' align="center" style={{fontSize:25,color:'#bdbdbd', padding:'50px 0'}}>nothing to show</Typography>
                }
            </div>
        </Grid>
    );
    
}

BookSegment.propTypes={
    classes:PropTypes.object.isRequired,
}

export default withStyles(styles,{withTheme:true})(BookSegment);