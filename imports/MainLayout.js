import React from 'react';
import Nav from '/imports/Nav.js';
import 'antd/dist/antd.css';
import { Layout, Breadcrumb } from 'antd';

const { Header, Content, Footer } = Layout;

export const MainLayout = ({content}) =>(
    
    
    <Layout className="layout">

    <Header>
      <div className="logo" />
        <Nav />
    </Header>

    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>{content}</div>
    </Content>

    <Footer style={{ textAlign: 'center' }}>
      Ant Design ©2018 Created by Ant UED
    </Footer>

  </Layout>
    
)