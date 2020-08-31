import React, { Component } from 'react'
import { Modal, Button, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './login.css'
import Register from '../Register/register'
import Cookies from 'js-cookie';
const backendURL = `http://${process.env.REACT_APP_BACK_END_HOST}:${process.env.REACT_APP_BACK_END_PORT}${process.env.REACT_APP_BACK_END_ROUTE}`

export default class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {
            email: undefined,
            password: undefined,

            visible: true,
            loading: false,

            registerVisible: false,
        }
    }

    registrationSelfClose = () => {
        this.setState({registerVisible: false})
    }

    login = async () => {        
        this.setState({ loading: true })     
        
        try{
            const response = await fetch(`${backendURL}/auth/public/login`, {
                method: "POST",
                headers: {   
                    'credentials': 'include',             
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({                
                    email: this.state.email,
                    password: this.state.password
                }),
                
            })                
            
            if (response.status === 200) {                                        
                const json = await response.json()
                Cookies.set('token', json.token)                
                this.props.onSuccess(json.token)
                this.setState({ visible: false })            
            } else {
                message.error('Falha no login, tente novamente')
            }
        }catch(e){
            message.error('Falha no login, tente novamente mais tarde')
        }
        

      this.setState({loading: false})
    }



    render() {

        const registerView = (
             <Register visible={this.state.registerVisible} selfClose={this.registrationSelfClose.bind(this)}/>
        )

        const loginModal = (
            <Modal className="modalLogin"
                title="Sign in"
                width={300}
                centered={true}
                visible={this.state.visible}
                closable={false}
                footer={[
                    <div className="modalLoginFooter" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button className="modalLoginButtonRegister"
                            style={{ backgroundColor: '#fff', borderColor: '#333', color: '#333' }}
                            onClick={() => this.setState({ registerVisible: true })}
                        >
                            Cadastro
                        </Button>
                        <Button className="modalLoginButtonLogin" type="primary"
                            style={{ backgroundColor: '#333', borderColor: '#333' }}
                            loading={this.state.loading}
                            onClick={() => this.login()}
                        >
                            Login
                        </Button>
                    </div>
                ]}
            >
                <div className="modalLoginBody">
                    <Input size="large" placeholder="Email" prefix={<UserOutlined />}
                        onChange={(value) => this.setState({ email: value.target.value })}
                    />
                    <Input.Password size="large" placeholder="Senha"
                        onChange={(value) => this.setState({ password: value.target.value })}
                    />
                </div>
            </Modal>
        )

        return (
            <div id="modalLogin">
                {loginModal}
                {registerView}
            </div>
        )
    }
}