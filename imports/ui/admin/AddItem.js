import React from 'react'
import { Button, Modal, Form, Input, message} from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const ModalCreateItem = Form.create()(
  class A extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Ajouter un nouvel Item"
          okText="Créer"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="Nom">
              {getFieldDecorator('nom', {
                rules: [{ required: true, message: 'Donne un nom a ton Item !' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="Description">
              {getFieldDecorator('description')(<TextArea autosize />)}
            </FormItem>
            <FormItem label="Commentaire sur l'état de l'objet">
              {getFieldDecorator('etat')(<TextArea autosize />)}
            </FormItem>
            <FormItem label="Caution">
              {getFieldDecorator('caution')(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      );
    }
  }
);



export default class AddItem extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  }

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      Meteor.call('addItem', values.nom,values.description,values.etat,values.caution,(error,result)=>{
        if(error)
          message.error(error.reason)
        else{
          message.success('Objet correctement ajouté')
        }
      })
      form.resetFields();
      this.setState({ visible: false });
    });
  }

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>Nouvel Objet</Button>
        <ModalCreateItem
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}