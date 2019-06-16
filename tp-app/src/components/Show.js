import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Typography, Avatar, Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {db} from '../config/FirebaseConfig';
import BookSegment from './BookSegment';


const styles=()=>({
  leftContainer: {
    display:'flex',
    backgroundColor:'#fff',
    boxShadow: '0.1rem 0.1rem 0.2rem rgba(0,0,0,0.1)',
    padding:20
  },
  sideBlock: {
    marginLeft:10,
    boxShadow: '0.1rem 0.1rem 0.2rem rgba(0,0,0,0.1)',
    backgroundColor:'#ffffff',
    padding:10
    
  },
  imageContainer:{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image:{
    height:400,
    width:'auto'
  },
  upperBlock:{
    lineHeight:40,
    color:'#666',
    border: '1px solid #666',
    margin:'10px 0',
    padding:5
  },
  button:{
    backgroundColor: "#10bbd5",
    width:'100%',
    height:43,
    borderRadius:6,
    margin:'10px 0',
    padding:'7px 0'
  },
  lowerBlock:{
    backgroundColor:'#fff',
    padding:10,
    marginTop:10,
    boxShadow: '0.1rem 0.1rem 0.2rem rgba(0,0,0,0.1)'
  },
  link:{
    cursor:'pointer',
    borderBottom: '1px dotted #aaa',
    '&:hover':{
      borderBottom:'1px solid black'
    }
  },
  link2:{
    cursor:'pointer',
    color:'#10bbd5',
    '&:hover':{
      borderBottom:'1px solid #10bbd5'
    },
    paddingLeft:5
  }
});

class Show extends React.Component{
  constructor(props){
    super(props);
    this.state={
        item:null,
        similar:[],
        goesWith:[]
    }
  }

  componentDidMount(){
      db.collection('books').doc(this.props.itemID).get().then(doc=>{
          const item = {...doc.data(),id:doc.id};
          
          db.collection('users').doc(item.uploaderID).get().then(doc=>{
            item.uploader = doc.data();
            this.setState({item});
          })

          db.collection("users").where("basket","array-contains",item.id).get().then(docs=>{
              docs.forEach(user=>{
                  user.data().basket.forEach(itemID=>{
                    db.collection("books").doc(itemID).get().then(doc=>{
                          if(doc.id!==item.id)
                              this.setState(state=>({goesWith:[...state.goesWith,{...doc.data(),id:doc.id}]}));
                      })
                  })
                  
              })
          })
          
          db.collection("books").where("author","==",item.author).get().then(docs=>{
              docs.forEach(doc=>{
                  if(doc.id!==item.id)
                      this.setState(state=>({similar:[...state.similar,{...doc.data(),id:doc.id}]}));
              })
          })

      });

  }

  render(){
    const {classes} = this.props;
    const item=this.state.item;
    
    if(item!==null){
      const details = {
        format: item.format,
        pages: item.pages,
        dimensions: item.dimensions.join(' x '),
        weight: item.weight,
        language: item.language,
        condition: item.condition,
      }

      let list=[];

      for(let k in details){
        list.push(<li style={{margin:'10px 0'}} key={k}><Typography variant="body1"><strong>{k.charAt(0).toUpperCase() + k.slice(1)}: </strong>{details[k]}</Typography></li>);
      }

      return (
        <div>
          <Grid container>
            <Grid item xs={12} className={classes.upperBlock}>
              <Typography variant='body1' style={{fontSize:17,verticalAlign:'middle'}}>
                Categories: {item.categories.join(' | ')}
              </Typography>
            
            </Grid>
            <Grid item xs={9} className={classes.leftContainer}>
                    <Grid item xs={4} className={classes.imageContainer}>
                        <img className={classes.image} src={item.image}/>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h4" style={{borderBottom:'1px solid rgb(240, 240, 240)'}}>
                            {item.title}
                        </Typography>
                        <div style={{height:60,margin:'10px 0'}}>
                          <Avatar style={{float:'left',width:60,height:60,cursor:'pointer'}} src={item.uploader.url}/>              
                          <div style={{lineHeight:60,padding:'10px 5px'}}>
                            <Typography variant="subtitle2" >
                              <span className={classes.link2}>{item.uploader.firstName + " " + item.uploader.lastName}</span>
                            </Typography>
                            <Typography variant="subtitle2" style={{color:'#616770'}}>
                              <span style={{paddingLeft:5}} >last thursday</span>
                            </Typography>
                          </div>
                        </div>
                        <Typography style={{fontSize:17}}>
                          By(author): <span className={classes.link}>{item.author}</span>
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                          {item.review}
                        </Typography>
                    </Grid>
            </Grid>
            <Grid item xs={3} >
                <div className={classes.sideBlock}>
                  <Typography variant="body1" style={{fontSize:30,color:'#ff0072',borderBottom:'1px solid rgb(240, 240, 240)'}}>
                    {item.price} $
                  </Typography>
                  <div style={{borderBottom:'1px solid rgb(240, 240, 240)'}}>
                    <Typography variant="body1" style={{fontWeight: 'bold',fontSize: '16px',marginTop:25}}>
                      <span style={{fontSize:25}}>🚀</span> Free delivery worldwide
                    </Typography>
                    <Typography variant="body2" style={{margin:"25px 0",marginBottom:10}}>
                      <span style={{fontSize:25}}>✔</span> Available. Dispatched from {item.uploader.city+", "+item.uploader.country}
                    </Typography>
                  </div>
                  <div>
                    <Button className={classes.button} onClick={()=>{this.props.handleBasketChange(item,'A')}}>
                      <span style={{color:'#fff',fontWeight: 'bold',fontSize: '12px'}}>Add to basket</span>
                    </Button>
                  </div>
                </div>
            </Grid>               
            <Grid item xs={12} className={classes.lowerBlock}>
              <Typography variant="body2" style={{fontSize:20,fontWeight:'bold',borderBottom:'1px solid rgb(240, 240, 240)'}}>
                Product details
              </Typography>
              <div>
                <ul style={{listStyle:'none'}} >
                  {list}
                </ul>
              </div>
            </Grid>  
            <BookSegment label="Similar Books" items={this.state.similar} handleBasketChange={this.props.handleBasketChange}/>
            <BookSegment label="Also Bougth With" items={this.state.goesWith} handleBasketChange={this.props.handleBasketChange}/>
          </Grid>
        </div>

      );
    }
    return null;
  }
}

Show.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Show);