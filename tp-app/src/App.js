import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { db, auth } from './config/FirebaseConfig';
import Basket from './components/Basket';
import BookSegment from './components/BookSegment';
import Base from './components/forms/signUp/Base';
import BookForm from './components/forms/book/BookForm';
import New from './components/forms/book/New';
import SignInForm from './components/forms/signIn/SignInForm'
import Show from './components/Show';
import Purchases from './components/Purchases';
import Requests from './components/Requests';
import RedirectDialog from './components/RedirectDialog';
import Uploads from './components/Uploads';
import Grid from '@material-ui/core/Grid';
import Body from './components/Body';  

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      user:null,
      items:[],
      inputValue:'',
      dialog:false
    }
  }

  handleChange=(e)=>{
    this.setState({inputValue:e.target.value});
  }


  componentDidMount(){

    db
    .collection('books')
    .orderBy('uploadTime','desc')
    .limit(25)
    .onSnapshot(snapshot=>{this.setState({items:snapshot.docs.map(doc=>({...doc.data(),id:doc.id}))});});

    auth.onAuthStateChanged((user)=>{
      if(user){
        db.collection('users').doc(user.uid).onSnapshot((snapshot)=>{

          const userData={...snapshot.data(), uid:user.uid};
          const bbasket = userData.basket;
          bbasket.forEach((itemID)=>{
            db.collection('books').doc(itemID).get().then(doc=>{userData.basket.push({...doc.data(),id:itemID})});
          });
          this.setState({user:userData});

          db.collection('books').where('uploaderID','==',user.uid).onSnapshot(snapshot=>{userData.uploads = snapshot.docs.map(doc=>({...doc.data(),id:doc.id}));});  
          
          db.collection('requests').where('owner','==',user.uid).onSnapshot(snapshot=>{
            userData.requests=[];
              snapshot.docs.forEach(doc=>{
                const req = doc.data();
                db.collection("books").doc(req.item).get().then(item=>{
                  db.collection("users").doc(req.buyer).get().then(buyer=>{
                    userData.requests.push(
                      {id:doc.id, item:{...item.data(), id:item.id}, buyer:{...buyer.data(), uid:req.buyer}, seen:req.seen, status:req.status }
                    )
                  })
                })
              })
              this.setState({user:userData});
            })

          db.collection('requests').where('buyer','==',user.uid).onSnapshot(snapshot=>{
            userData.purchased=[];
              snapshot.docs.forEach(doc=>{
                const req = doc.data();
                db.collection("books").doc(req.item).get().then(item=>{
                  db.collection("users").doc(req.owner).get().then(owner=>{
                    userData.purchased.push({item:{...item.data(), id:item.id}, owner:{...owner.data(), uid:req.owner}, status:req.status})
                  })
                })
              })
              this.setState({user:userData});
          })

        });
        
      }
      else{

        this.setState({ user:null });
        
      }
      
    });
    
  }

  handleBasketChange=(item,action)=>{

    const { user } = this.state;

    if(user===null){
      this.setState({dialog:true});
    }
    else{

      if(action==="A" && !(new Set(user.basket.map(e=>e.id)).has(item.id))){
        user.basket.push(item);
      } else{
        user.basket = user.basket.filter(e=>e !== item);
      }
       
      db.collection('users').doc(user.uid).update({basket:user.basket.map(item=>item.id)});

    }
  }

  handleFinalize=()=>{

    this.state.user.basket.forEach(item=>{
      db.collection('requests').doc().set(
        {
          item:item.id,
          owner:item.uploaderID,
          buyer:this.state.user.uid,
          seen:false,
          status:0,
        }
      );

    });

    db.collection("users").doc(this.state.user.uid).update({basket:[]});
    
  }

  handleSeen=()=>{
    this.state.user.requests.forEach(e => {
      db.collection('requests').doc(e.id).update({seen:true});
    });
  }

  acceptRequest=(req)=>{
    db.collection('requests').doc(req.id).update({status:2}).then(()=>{
      db.collection('requests')
        .where('item','==',req.item.id)
        .where('status','<',2)
        .where('status','>',2)
        .update({staus:1});
    });

    db.collection("books").doc(req.item.id).update({available:false});
  }

  rejectRequest=(req)=>{
    db.collection('requests').doc(req.id).update({status:1});
  }

  handleDialogClose=()=>{
    this.setState({dialog:false});
  }

  render() {
    const { state, props } = this;
    const items = state.items.filter(item=>{
      if(state.user!==null)
        return item.available && item.uploaderID!==state.user.uid; 
      return item.available
    });

    return (
      <Grid container>
        <Grid item xs={1}/>
        <Grid item xs={10}>
          <RedirectDialog {...props} open={state.dialog} handleDialogClose={this.handleDialogClose}/>
          <Layout {...props} user={state.user}>
            <div style={{marginTop:100,}}>
              <Switch>
                <Route path='/signIn' component={SignInForm}/>
                <Route path='/signUp' component={Base}/>
                <Route path='/b/:id' render={(props)=><Show {...props} itemID={props.match.params.id} handleBasketChange={this.handleBasketChange}/>}/>
                <Route path='/e/:id' render={(props)=><BookForm {...props} uploader={state.user}/>}/>
                <Route path='/new' render={(props)=><New {...props} uploader={state.user}/>}/>
                <Route path='/basket' render={(props)=><Basket {...props} items={state.user.basket} handleBasketChange={this.handleBasketChange} handleFinalize={this.handleFinalize}/>}/>
                <Route path='/purchases' render={(props)=><Purchases {...props} items={state.user.purchased}/>}/>
                <Route path='/requests' render={(props)=><Requests {...props} items={state.user.requests} acceptRequest={this.acceptRequest} rejectRequest={this.rejectRequest}/>}/>
                <Route path='/uploads' render={(props)=><Uploads {...props} items={state.user.uploads}/>}/>
                <Route path='/' render={(props)=><Body {...props} items={items} handleBasketChange={this.handleBasketChange}/>}/>
              </Switch>
            </div>
          </Layout>
        </Grid>
        <Grid item xs={1}/>
      </Grid>
    );
  }
}

export default withRouter(App);
