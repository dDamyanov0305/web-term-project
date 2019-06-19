import React from 'react';
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types';
import {Typography, Grid} from '@material-ui/core';
import BookSegment from './BookSegment';
import SideList from './SideList';

const styles = () =>({
    root:{
        padding:5,
    },
    firstRow:{
        height:200,
        backgroundColor:'#fff',
        boxShadow: '0.1rem 0.1rem 0.2rem rgba(0,0,0,0.1);',
    },
    image:{
        overflow:'hidden',
        width:'100%',
        height:'100%'
    }

});


const Body = (props) =>{

    const { classes } = props;
    const labels = ['Best Ever Book List','Popular Reading Lists'];
    const map = {
        'Best Ever Book List':[
            'Beautiful Books',
            'More Beautiful Books',
            'Best Books Ever',
            'Best Cookbooks Ever',
            'Best Crime & Thriller Books'
        ],
        'Popular Reading Lists':[
            'Highlights This Month',
            'Star Wars',
            'Annuals',
            'Literary Prizes',
            'New Releases',
            'Textbooks',
            'Harry Potter Book Series',
            'Game of Thrones',
            'Book Club Classics',
            'Books on Screen',
            'Twilight Book Series',
            'Fantasy Books',
            'Business Books',
            'War History Books',
        ]
    }

    const map2={
        Recent:props.items,
        Horror:props.items.filter(e=>e.categories.includes('Horror')),
        Fantasy:props.items.filter(e=>e.categories.includes('Fantasy')),
    }

    const segments =[];
    for(let key in map2){
        segments.push(<BookSegment label={key} items={map2[key]} handleBasketChange={props.handleBasketChange}/>)
    }

    return(
        <div style={{ display:'flex'}}>
            <Grid item xs={3}>
                {labels.map((label,index)=>(<SideList key={index} label={label} list={map[label]}/>))}
            </Grid>
            <Grid item xs={9} >
                <div style={{ display:'flex'}}>

                    <Grid item xs={8} className={classes.root}>
                        <div className={classes.firstRow}>
                            <img className={classes.image} src="https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/content/TBD11081%20Bargain%20Refresh_1112x223_no_cta.jpg"/>
                        </div>
                    </Grid>

                    <Grid item xs={4} className={classes.root}>
                        <div className={classes.firstRow}></div>
                    </Grid>
                </div>

                {segments}

            </Grid>

        </div>
    );
}

Body.propTypes={
    classes:PropTypes.object.isRequired,
}

export default withStyles(styles)(Body);