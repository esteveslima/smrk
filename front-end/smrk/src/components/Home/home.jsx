import Login from '../Login/login'
import Cookies from 'js-cookie';
import { Input, Button, List, message } from 'antd';
import 'antd/dist/antd.css';
import './home.css'
import jwt from 'jsonwebtoken';
import { PlayCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import React, { Component } from 'react'


const { TextArea } = Input;
const backendURL = `http://${process.env.REACT_APP_BACK_END_HOST}:${process.env.REACT_APP_BACK_END_PORT}${process.env.REACT_APP_BACK_END_ROUTE}`

export default class Home extends Component {

    #authToken = undefined;

    constructor(props) {
        super(props)                

        this.state = {
            
            user: undefined,

            fieldRegisterComment: '',
            loadingRegister: false
        }

    }

    getUser = async (userId) => {  console.log(this.#authToken)
        const responseUser = await fetch(`${backendURL}/user/get/${userId}`, {
            method: "GET",
            headers: {
                'Authorization' : `Bearer ${this.#authToken}`,
                'Content-Type': 'application/json',              
            }
        })
        if(responseUser.status !== 200){
            message.error('Falha na requisição responseUser');
            return;
        }
        const responseJson = await responseUser.json()
        
        this.setState({
            user: responseJson.user,
        })
    }

    getAudioStream = async (comment) => { 
        try{
            const responseIBM = await fetch(`${process.env.REACT_APP_IBM_API_URL}/v1/synthesize`, {
                method: "POST",
                headers: {
                    'Authorization' : 'Basic '+ btoa(`apikey:${process.env.REACT_APP_IBM_API_KEY}`),  
                    'Content-Type': 'application/json',
                    'Accept': 'audio/wav',                
                },
                body: JSON.stringify({                
                    text: comment
                }),                         
            })                  
                    
            return responseIBM
        }catch(e){
            message.error('Falha na requisição getAudioStream')
            return undefined
        }            
    }

    playSound = async (comment) => {        
        const responseStream = await this.getAudioStream(comment)
        if(!responseStream) return 
        const streamReader = responseStream.body.getReader();        
        let stream = []
        streamReader.read().then(function processStream({done, value}){
            if(done){   
                console.log('Stream complete, playing')                  
                var blob = new Blob(stream, { type: 'audio/wav' });
                var url = window.URL.createObjectURL(blob)        
                window.audio = new Audio();
                window.audio.src = url;                            
                window.audio.play()                    
                return;
            }else{
                console.log('Reading stream')
                stream.push(value);
                return streamReader.read().then(processStream);
            }
        })
        
        return
    }


    registerComment = async () => {     
        this.setState({
            loadingRegister: true
        })   
        try{
            const responseRegistration = await fetch(`${backendURL}/comment/create`, {
                method: "POST",
                headers: {
                    'Authorization' : `Bearer ${this.#authToken}`,
                    'Content-Type': 'application/json',              
                },
                body: JSON.stringify({
                    userId: this.state.user.id,  
                    text: this.state.fieldRegisterComment
                }),
            })
            if(responseRegistration.status !== 200){
                message.error('Falha na requisição registerComment');
                this.setState({
                    loadingRegister: false
                })
                return;
            }            

            const resultRegistration = await responseRegistration.json()     
            
            const updatedComments = [...this.state.user.comments, resultRegistration.comment]
            const updatedUser = this.state.user;
            updatedUser.comments = updatedComments;
    
            this.setState({
                user: updatedUser,
                fieldRegisterComment: '',
                loadingRegister: false
            })
        }catch(e){
            message.error('Falha na requisição registerComment');
            this.setState({
                loadingRegister: false
            })
        }        
    }

    deleteComment = async (deletedComment) => {     
        try{
            const responseDelete = await fetch(`${backendURL}/comment/delete/${deletedComment.id}`, {
                method: "DELETE",
                headers: {
                    'Authorization' : `Bearer ${this.#authToken}`,
                    'Content-Type': 'application/json',              
                }
            })
            if(responseDelete.status !== 200){
                message.error('Falha na requisição deleteComment');
                return;
            }            
                 
            const updatedComments = this.state.user.comments.filter((comment) => comment.id !== deletedComment.id)
            const updatedUser = this.state.user;
            updatedUser.comments = updatedComments;
            
            this.setState({
                user: updatedUser,
            })
        }catch(e){
            message.error('Falha na requisição deleteComment');
        }        
    }


    render() {   

        const loginView = (
            <Login onSuccess={(userToken) => {                
                this.#authToken = userToken   
                const token = jwt.decode(userToken);             
                this.getUser(token.id) 
            }} />
        )

        const registerComment = (
            <div className="registerComment" style={{position: 'absolute', top: '10%', left: '5%', width: '45%', height: '70%'}}>
                <span style={{position: 'absolute', top: '10%', left: '5%', fontSize: 25}}>Insira um novo comentário</span>
                <TextArea rows={10} 
                    style={{position: 'absolute', top: '20%', left: '5%', width: '80%', height: '50%'}} 
                    onChange={(value) => this.setState({ fieldRegisterComment: value.target.value })}
                    value={this.state.fieldRegisterComment}
                />
                <Button className="buttonRegisterComment" type="primary"
                    style={{position: 'absolute', bottom: '10%', left: '5%', backgroundColor: '#333'}}
                    loading={this.state.loadingRegister}
                    onClick={() => {
                        if(this.state.fieldRegisterComment.length < 5){
                            message.error('Comentário muito pequeno')
                            return
                        }
                        this.registerComment()
                    }}
                >
                    Cadastrar
                </Button>
            </div>
        )

        const commentsList = (
            <div className="commentsList" style={{position: 'absolute', top: '10%', right: '5%', width: '45%', height: '70%'}}>
                <span style={{position: 'absolute', top: '10%', right: '5%', fontSize: 25}}>Comentários cadastrados</span>
                <List
                    itemLayout="horizontal"
                    style={{position: 'absolute', top: '20%', right: '5%', width: '90%'}}
                    dataSource={this.state.user?.comments || []}
                    renderItem={comment => (
                    <List.Item>
                        <div style={{width: '100%'}}>
                            <div style={{height: 80, float: 'left', width: '10%'}}>
                                <PlayCircleOutlined style={{fontSize: 40, cursor: 'pointer'}} twoToneColor="#947119"
                                    onClick={() => this.playSound(comment.text)}
                                />
                            </div>  
                            <div style={{left: '10%', height: 80, display: 'flex', alignItems: 'left', float: 'left', width: '70%'}}>
                                <span>{comment.text}</span>
                            </div>  
                            <div style={{height: 80, float: 'right', width: '10%'}}>                            
                                <CloseCircleOutlined style={{fontSize: 40, cursor: 'pointer'}} twoToneColor="#947119"
                                    onClick={() => this.deleteComment(comment)}
                                />
                            </div>                             
                        </div>                                            
                    </List.Item>
                    )}
                />
            </div>
        )

        const logoutButton = (
            <div className="logoutButton" style={{position: 'absolute', top: '5%', right: '5%', width: 100, height: 50}}>
                <Button className="buttonRegisterComment"
                    style={{position: 'absolute', top: '10%', left: '5%', backgroundColor: '#fff', borderColor: '#333', color: '#333'}}
                    loading={this.state.loadingRegister}
                    onClick={() =>  this.setState({user: undefined})}
                >
                    Logout
                </Button>
            </div>
        )
    
        const homeView = (
            <div className="homeView">
                {registerComment}                
                {commentsList}
                {logoutButton} 
            </div>
        )

        return (
            <div id="homePage">
                {
                    this.state.user ? homeView : loginView
                }                
            </div>
        )
    }
}