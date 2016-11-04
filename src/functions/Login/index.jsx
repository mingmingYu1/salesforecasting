import React, { PropTypes } from 'react'
import { Form, FormItem } from 'bfd/Form2'
import FormInput from 'bfd/FormInput'
import { Checkbox } from 'bfd/Checkbox'
import xhr from 'bfd/xhr'
import auth from 'public/auth'
import Icon from 'bfd-ui/lib/Icon'
import './index.less'

export default React.createClass({

  contextTypes: {
    history: PropTypes.object
  },

  getInitialState() {
    this.rules = {
      username(v) {
        if (!v) return '请输入用户名'
      },
      password(v) {
        if (!v) return '请输入密码'
      }
    }
    return {
      user: {}
    }
  },

  handleChange(user) {
    this.setState({ user })
  },

  handleLogin() {
    this.refs.form.save()
  },

  handleSuccess(user) {
    auth.register(user)
    let referrer = this.props.location.state && this.props.location.state.referrer || '/'
    this.context.history.push(referrer)
  },

  handleRemember(e) {
    const user = this.state.user
    user.remember = e.target.checked
    this.setState({ user })
  },

  render() {
    return (
      <div className="login">
        <div className="header">
          <div className="pull-left">
            <img src={require('public/logo.png')} />
          </div>
        </div>
        <div className="body">
          <Form ref="form" action="login.json" onSuccess={this.handleSuccess} data={this.state.user} onChange={this.handleChange} labelWidth={0} rules={this.rules}>
            <div className="imgContainer">
              <img className="img-responsive" src={require('./nameAll.png')} alt="登录"/>
            </div>
            <div className="nameHeader"> 用户登录 </div>
            <FormItem name="username">
              <span className="loginIcon"><Icon type="user" /></span>
              <FormInput placeholder="填写用户名"></FormInput>
            </FormItem>
            <FormItem name="password">
              <span className="loginIcon"><Icon type="lock" /></span>
              <FormInput placeholder="输入密码" type="password"></FormInput>
            </FormItem>
            <FormItem name="remember">
              <Checkbox onChange={this.handleRemember}>下次自动登录</Checkbox>
            </FormItem>
            <button type="submit" className="btn btn-primary" onClick={this.handleLogin}>登录</button>
          </Form>
        </div>
        <div className="footer">Copyright © 2016 All rights reserved. 前海云游版权所有</div>
      </div>
    )
  }
})