import React from 'react'
import { Input, message, Modal,Form } from 'antd';
import { Items } from '/imports/api/Collections.js'
const Search = Input.Search;
const FormItem = Form.Item;
const { TextArea } = Input;

const ModalUpdateItem = Form.create()(
    class A extends React.Component {
      render() {
        const { visible, onCancel, onUpdate, form, item } = this.props;
        const { getFieldDecorator } = form;
        return (
          <Modal
            visible={visible}
            title="Mettre à jour un objet"
            okText="Mettre à Jour"
            onCancel={onCancel}
            onOk={onUpdate}
          >
            <Form layout="vertical">
              <FormItem label="Nom">
                {getFieldDecorator('nom', {
                  rules: [{ required: true, message: 'Donne un nom a ton Item !' }],
                  initialValue:item.nom
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem label="Description">
              {getFieldDecorator('description',{initialValue:item.description})(<TextArea autosize  />)}
              </FormItem>
              <FormItem label="Commentaire sur l'état de l'objet">
                {getFieldDecorator('etat',{initialValue:item.etat})(<TextArea autosize />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('id',{initialValue:item._id,})(<Input type='hidden' />)}
              </FormItem>
            </Form>
          </Modal>
        );
      }
    }
  );
export default class SearchItem extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            visible: false,
            item: {nom:'',description:'',etat:''}
        }
    }
    componentWillUnmount(){
        this.state.itemsSub.stop();
      }
      componentDidMount(){
        this.state.itemsSub = Meteor.subscribe('items')
      }
      
    handleSearch = (value) =>{
        if(value.trim() == '')
            return
        let item = Items.findOne(value)
        if(!item){
            message.error('l objet n existe pas')
            return
        }
        console.log("aaa");
            this.setState({visible:true,item:item})            
        }
    

    handleUpdate = () =>{
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
        if (err) {
            return;
        }

        console.log('Received values of form: ', values);
        Meteor.call('updateItem',values.id, values.nom,values.description,values.etat,(error,result)=>{
            if(error)
                message.error(error.reason)
            else{
                message.success('Objet correctement modifié')
            }
        })
        form.resetFields();
        this.setState({ visible: false });
        });
    }

    handleCancel = () =>{
        this.setState({ visible: false });
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef;
      }


    render(){
        return(
            <div>
                <Search
                    placeholder="input search text"
                    enterButton="Search"
                    size="large"
                    onSearch={value => this.handleSearch(value)}
                />
                <ModalUpdateItem
                    wrappedComponentRef={this.saveFormRef}  
                    visible={this.state.visible}
                    onUpdate={this.handleUpdate}
                    onCancel={this.handleCancel}
                    item={this.state.item}
                />
                
            </div>
        )
    }
}