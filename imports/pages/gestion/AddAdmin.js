import React, { Component } from 'react'
import {Form, Button,Select, Spin, message} from 'antd';
const { Option } = Select;

class FormAddAdmin extends Component {

    constructor(props) {
        super(props)
        this.state = {
            usersdata:null
        }
    }
    componentWillUnmount(){
        this.state.usersdata.stop();
    }
    componentDidMount(){
        this.state.usersdata = Meteor.subscribe('userData')
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            Meteor.call('addAdmins', JSON.stringify(values), (error,result)=>{
                if(error){
                    message.error('error')
                  }else{
                    message.success('admins ajoute');
                  }              
                })
            }
          })
        
    }
    getGroups(){
        let res = Meteor.users.find({ 'roles': {$ne:null}}).fetch()
        let tmp = [];
        for(let user of res) {
            let assos = Object.keys(user.roles)
            for(let asso of assos)
                tmp.push(asso)
        }
        let groups = new Set(tmp)
        return Array.from(groups.values()).map(asso => (<Option key={asso}>{asso}</Option>))
                                
    }

    render(){
        const { fetching, data, value } = this.state;
        const { getFieldDecorator } = this.props.form;
            return (
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item label="Ajouter un ou plusieurs admin">
                        {getFieldDecorator('admins', {
                            rules: [
                            { required: true, message: 'Choisissez une personne', type: 'array' },
                            ],
                        })(
                            <Select 
                                mode="multiple" 
                                placeholder="Choisissez une ou plusieurs personnes"
                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                onSearch={this.getUsers}
                                onChange={this.handleChange}
                                style={{ width: '100%' }}
                            >
                            {Meteor.users.find({}).fetch().map(user => (<Option key={user._id}>{user.firstName +" "+ user.lastName}</Option>))}
                            </Select>
                        )}
                        <Form.Item label="Asso" hasFeedback>
                        {getFieldDecorator('asso', {rules: [{ required: true, message: 'Choisissez une asso' }],})(
                            <Select placeholder="Choisissez une asso" mode="tags" tokenSeparators={[' ']}>
                            {this.getGroups()}
                            </Select>
                        )}
                        </Form.Item>
                        
                        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form.Item>
                </Form>
            )
    }
}

const AddAdmin = Form.create()(FormAddAdmin);
export default AddAdmin;