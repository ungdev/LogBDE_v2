import React, { Component } from 'react'
import { Select, message, Form, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class Admin extends Component {

    constructor(props){
        super(props)
        this.state = {
            data: [],
            value: undefined,
          }
    }

    handleSearch = (value) => {
        Meteor.call('getUsernames',value, (error,data)=>{
          if(error)
            message.error(error.reason)
          else
            this.setState({ data })
        })
      }
    
      handleChange = (value) => {
        this.setState({ value });
      }
    
      handleClick = () =>{
        Meteor.call('addAdmin',this.state.value,(error,result)=>{
          if(error)
            message.error(error.reason)
          else message.success('Ajout réussi')
        })
      }
    


    render(){
        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
        return(
            <div className="center" >
            <h1>Ajouter un Admin</h1>
                <Form onSubmit = {this.handleSubmit}>
                    <FormItem>
                        <Select
                            showSearch
                            value={this.state.value}
                            placeholder={this.props.placeholder}
                            style={this.props.style}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            onSearch={this.handleSearch}
                            onChange={this.handleChange}
                            notFoundContent={null}
                            maxTagCount={8}
                        >
                        {options}
                        </Select>
                    </FormItem>

                    <FormItem>
                    <Button type="primary" onClick={this.handleClick}>Add as Admin</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export const AddAdmin = Form.create()(Admin);