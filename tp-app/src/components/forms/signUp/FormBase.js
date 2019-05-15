import React, { Component } from 'react';
import StepperForm from './StepperForm'
import { auth, db, storage } from '../../../config/FirebaseConfig'

class FormBase extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            avatar: false,
            color:'',
            image:'',
            file:'',
            addressLine1: '',
            addressLine2: '',
            city: '',
            region: '',
            zip: '',
            country: '',
            basket:[],
            purchased:[],
            message:'',
        }
    }
    

    handleSubmit = (e) => {
        e.preventDefault();
        const { password, image, avatar, file, color, ...rest } = this.state;

        auth
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(cred=>{
                
                db.collection("users").doc(cred.user.uid).set(rest);

                if(avatar){
                    storage.ref().child('avatars/'+cred.user.uid).put(this.state.file).then((snapshot)=>{
                        snapshot.ref.getDownloadURL().then(url=>{
                            db.collection("users").doc(cred.user.uid).update({url});
                        })
                    });
                   
                } 
                setTimeout(()=>{this.props.history.push('/');},3500);
            })
            .catch(err=>{this.setState({message:err.message})});

            
    }

    handleChange = (e) =>{
        if(e.target.name==="file"){
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend=()=>{
                this.setState({ file, image : reader.result, avatar:true });
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
        return (
            <StepperForm 
                state={this.state} 
                handleSubmit={this.handleSubmit} 
                handleChange={this.handleChange}
            />
        );
    }

}

export default FormBase;