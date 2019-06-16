import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Typography, Avatar, Button, TextField,Grid,Input } from '@material-ui/core';
import {db, storage} from '../../../config/FirebaseConfig';


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
    width:'auto',
    overflow:'auto'
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

class New extends React.Component{
  constructor(props){
    super(props);
    this.state={
        format:'',
        pages:'',
        weigth:'',
        dimensions:'',
        language:'',
        title:'',
        author:'',
        price:'',
        image:null,
        file:'',
        review:'',
        condition:'',
        categories:'',
    }
  }

    handleSubmit=(e)=>{
        const { image, file, ...rest } = this.state;

        rest.categories=rest.categories.split(",");
        rest.dimensions=rest.dimensions.split("x");

                db.collection('books').add({
                    ...rest,
                    available:true,
                    uploadTime:new Date(),
                    uploaderID:this.props.uploader.uid,
                })
                .then((docRef)=>{
                    storage.ref().child('books/'+docRef.id).put(file).then(snapshot=>{
                        snapshot.ref.getDownloadURL().then((url)=>{
                            docRef.update({image:url}).then(()=>{this.props.history.push("/uploads")})
                        })
                    })
                    
                })

    }   

    handleChange = (e) =>{
        if(e.target.name==="file"){
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend=()=>{
                this.setState({ file, image : reader.result });
            }

            if(file){
                reader.readAsDataURL(file);
            }
            
        }
        else{
            this.setState({[e.target.name]:e.target.value});
        }
    }   


  render(){
    const {classes} = this.props;
    const item=this.state;
    
      const details = {
        format: item.format,
        pages: item.pages,
        language: item.language,
        weight: item.weight,
        dimensions: item.dimensions,
        condition: item.condition,
      }

      let list=[];

      for(let k in details){
        list.push(
            <li style={{margin:'10px 0'}} key={k}>
                <Typography variant="body1" >
                    <strong >{k.charAt(0).toUpperCase() + k.slice(1)}: </strong>
                    <TextField
                        style={{verticalAlign:'baseline'}}
                        required
                        value={this.state[k]}
                        name={k}
                        type="text"
                        onChange={this.handleChange} 
                    />
                </Typography>
            </li>
        );
      }

      

      return (
        <div>
          <Grid container>
            <Grid item xs={12} className={classes.upperBlock}>
              <Typography variant='body1' style={{fontSize:17,verticalAlign:'middle'}}>
                Categories: 
                <TextField
                    required
                    value={this.state.categories}
                    name='categories'
                    type="text"
                    onChange={this.handleChange}
                    fullWidth 
                />
              </Typography>
            
            </Grid>
            <Grid item xs={9} className={classes.leftContainer}>
                    <Grid item xs={4} className={classes.imageContainer}>
                        <Input 
                            required 
                            style={{display:'none'}}
                            type="file"
                            name="file" 
                            inputRef={input=>(this.input=input)} 
                            onChange={this.handleChange}
                            fullWidth
                        />
                        <img 
                            className={classes.image} 
                            style={{cursor:'pointer'}}
                            src={item.image!=null?
                                item.image:
                                "https://upload.wikimedia.org/wikipedia/commons/7/72/Placeholder_book.svg"
                            }
                            onClick={()=>{this.input.click()}}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h4" style={{borderBottom:'1px solid rgb(240, 240, 240)'}}>
                            <TextField
                                required
                                value={this.state.title}
                                name='title'
                                type="text"
                                onChange={this.handleChange}
                                fullWidth 
                            />
                        </Typography>
                        <div style={{height:60,margin:'10px 0'}}>
                          <Avatar style={{float:'left',width:60,height:60,cursor:'pointer'}} src={this.props.uploader.url}/>              
                          <div style={{lineHeight:60,padding:'10px 5px'}}>
                            <Typography variant="subtitle2" >
                              <span className={classes.link2}>{this.props.uploader.firstName + " " + this.props.uploader.lastName}</span>
                            </Typography>
                            <Typography variant="subtitle2" style={{color:'#616770'}}>
                              <span style={{paddingLeft:5}} >last thursday</span>
                            </Typography>
                          </div>
                        </div>
                        <Typography style={{fontSize:17}}>
                          By(author):
                          <TextField
                                required
                                value={this.state.author}
                                name='author'
                                type="text"
                                onChange={this.handleChange}
                            /> 
                        </Typography>
                        <br/>
                        <Typography variant="body1">
                            <TextField
                                multiline
                                rowsMax="10"
                                required
                                value={this.state.review}
                                name='review'
                                type="text"
                                onChange={this.handleChange}
                                fullWidth 
                            />
                        </Typography>
                    </Grid>
            </Grid>
            <Grid item xs={3} >
                <div className={classes.sideBlock}>
                  <Typography variant="body1" style={{fontSize:30,color:'#ff0072',borderBottom:'1px solid rgb(240, 240, 240)'}}>
                    <TextField
                        required
                        value={this.state.price}
                        name='price'
                        type="number"
                        onChange={this.handleChange} 
                    /> $
                  </Typography>
                  <div style={{borderBottom:'1px solid rgb(240, 240, 240)'}}>
                    <Typography variant="body1" style={{fontWeight: 'bold',fontSize: '16px',marginTop:25}}>
                      <span style={{fontSize:25}}>🚀</span> Free delivery worldwide
                    </Typography>
                    <Typography variant="body2" style={{margin:"25px 0",marginBottom:10}}>
                      <span style={{fontSize:25}}>✔</span> Available. Dispatched from {this.props.uploader.city+", "+this.props.uploader.country}
                    </Typography>
                  </div>
                  <div>
                    <Button className={classes.button} onClick={this.handleSubmit}>
                      <span style={{color:'#fff',fontWeight: 'bold',fontSize: '12px'}}>Add to store</span>
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
          </Grid>
        </div>

      );
  }
}

New.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(New);