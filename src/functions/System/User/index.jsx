import React from 'react'
import Fetch from 'bfd-ui/lib/Fetch'
import xhr from 'bfd-ui/lib/xhr'
import { Link } from 'react-router'
import DataTable from 'bfd-ui/lib/DataTable'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import confirm from 'bfd-ui/lib/confirm'
import message from 'bfd-ui/lib/message'
import Button from 'bfd-ui/lib/Button'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import FormInput from 'bfd-ui/lib/FormInput'
import { Select, Option } from 'bfd-ui/lib/Select2'
import ClearableInput from 'bfd-ui/lib/ClearableInput'
import { CheckboxGroup, Checkbox } from 'bfd-ui/lib/Checkbox'
import { RadioGroup, Radio } from 'bfd-ui/lib/Radio'
import './index.less'

export default React.createClass({

  getInitialState() {

    //    验证
    this.rules ={
      realName(v) {
        if(!v) {return '姓名不可为空！！'}
        if(v.length > 20) {return '姓名长度不可大于20字符！！'}
      },
      userName(v) {
        if(!v) {return '用户名不可为空！'}
        if(v.length > 20) {return '用户名长度不可大于20字符！！'}
      },
      password(v) {
        if(!v) {return '密码不可为空！'}
        if(v.length > 20 && v.length < 8) {return '密码长度不可大于20或小于8字符！！'}
      },
      deptId(v) {
        if(!v) {return '部门不可为空！'}
      },
      roles(v) {
        if(!v || v.length === 0) {return '必须选择一个角色！'}
      }
    }

    return {
      tableUrl: 'system/user/tableUrl.json?queryType=0',         //  /user/query
      column: [
        {
          title:'姓名',
          key:'realName'
        },{
          title:'账号',
          key:'userName'
        },{
          title:'所属部门',
          key:'deptName'
        },{
          title:'所属角色',
          key:'roles'
        },{
          title:'操作',
          render:(item, component)=> {
            return (
              <span>
                <a href = "javascript:void(0);" onClick = { () => {this.handleClickEdit(item)} }>编辑</a>&nbsp;&nbsp;
                <a href = "javascript:void(0);" onClick = { () => {this.handleClickRemove(item)} }>删除</a>
              </span>
            )
          },
          key: 'operation'
        }
      ],
      queryType: '0',
      value: '',
      userBig: false,
      checkData: [],
      formData: {}
    }
  },

  //  增
  handleClickAdd() {
    this.refs.modal.open()
    this.setState({
      buttonText: '创建',
      text: '新增',
      edit: false,
      userBig: false,
      radioBrand: '1',
      formData: {
        deptId: '',
        status: '1',
        roles: []
      }
    })
  },

  //  删
  handleClickRemove(item){
    confirm('您确认要删除该用户吗？', () => {
      this.removeAjax(item.userId)
    })
  },

  //   删除请求
  removeAjax(userId) {
    xhr({
      type: 'POST',
      url: 'user/deleteUser',
      data: {userId: userId},
      success: this.handleRemoveSuccess
    })
  },

  //  删除成功回调
  handleRemoveSuccess(res) {
    if (res.code === 201) {
      message.success(res.message, 2)
      this.setState({tableUrl: 'system/user/tableUrl.json?queryType=0&time='+new Date()})     //  /user/query
    } else {
      message.danger(res.message)
    }
  },

  //  改
  handleClickEdit(item) {
    this.refs.modal.open()
    let roles = []
    if (item.roleIds) {
      item.roleIds.split(",").map((item) => {
        roles.push(Number(item))
      })
    }
    this.setState({
      text: '编辑',
      buttonText: '保存',
      edit: true,
      userBig: item.userId === 1,
      formData: {
        userId: String(item.userId),
        realName: item.realName,
        userName: item.userName,
        password: item.password,
        deptId: item.deptId,
        status: item.status,
        roles: roles
      }
    })
  },

  //  查
  handleInquire() {
    this.setState({tableUrl: 'system/user/tableUrl.json?queryType='+this.state.queryType+'&value='+this.state.value})
  },

  // 重置
  handleReset() {
    this.setState({
      tableUrl: 'system/user/tableUrl.json?queryType=0',
      queryType: '0',
      value: ''
    })
  },

  //  查询下拉
  handleSelect(queryType) {
    this.setState({queryType: queryType})
  },

  //  查询input
  handleInput(value) {
    this.setState({value: value})
  },

  //  表单下拉
  handleFormSelect(deptId) {
    this.refs.selectItem.validate(deptId)
    const formData = this.state.formData
    formData.deptId = deptId
    this.setState({formData})
  },

  //   多选框成功回调
  handleCheckSuccess(checkData) {
    this.setState({checkData})
  },

  //  表单多选择框
  handleFormCheckBox(roles) {
    this.refs.checkBoxItem.validate(roles)
    const formData = this.state.formData
    formData.roles = roles
    this.setState({formData})
  },

  //  表单单选
  handleFormRadio(status) {
    const formData = this.state.formData
    formData.status = status
    this.setState({formData})
  },

  //  表单改变
  handleFormChange(formData) {
    this.setState({ formData })
  },

  //  表单提交按钮
  handleFormSave() {
    console.log(this.state.formData)
    if (this.state.formData.userId == 1) {
      message.danger("管理员不让修改！")
      return
    }
    this.refs.form.validate(this.state.formData)
    this.refs.form.save()
  },

  //  表单成功回调
  handleFormSuccess(res) {
    if (res.code === 201) {
      this.refs.modal.close();
      message.success(res.message, 2)
      this.setState({
        tableUrl: 'system/user/tableUrl.json?queryType=0&time='+new Date(),
        queryType: '0',
        value: ''
      })
    } else {
      message.danger(res.message)
    }
  },

  //  表单取消按钮
  handleFormClose() {
    this.refs.modal.close();
  },

  onPageChange() {},

  render() {


    const styleInput = {}
    const styleRadio = {}
    styleInput.display = this.state.edit ? 'none' : 'block'
    styleRadio.display = this.state.edit ? 'block' : 'none'
    //   表单提交    /role/getRoleIdName
    //   角色     /role/getRoleIdName
    //   表单下拉框      /dept/getDeptIdName
    const render = item => <Option value={item.deptId}>{item.deptName}</Option>
    return (
      <div className="function-user">
        <div className="link"><Link to={'/system'}>系统管理</Link> > <span>用户管理</span></div>
        <div className="marginTop selectText">
          <div className="inlineBlock">
            <span>类别：</span>
            <Select value={this.state.queryType} onChange={this.handleSelect}>
              <Option value="0">全部</Option>
              <Option value="1">按部门</Option>
              <Option value="2">按角色</Option>
              <Option value="3">按姓名</Option>
            </Select>
          </div>
          <div className="inlineBlock">
            <span>关键字：</span>
            <ClearableInput placeholder="请输入关键字" inline={true} value={this.state.value} onChange={this.handleInput}/>
          </div>
          <div className="inlineBlock">
            <Button type="primary" onClick={this.handleInquire}>查询</Button>
            <Button type="primary" onClick={this.handleReset}>重置</Button>
          </div>
        </div>
        <button className='btn btn-primary marginTop' onClick={this.handleClickAdd}>
          <sapn className='glyphicon glyphicon-plus'></sapn>&nbsp;&nbsp;新增
        </button>
        <div className='marginTop tableContainer'>
          <DataTable
            url={this.state.tableUrl}
            onPageChange={this.onPageChange}
            showPage="true"
            column={this.state.column}
            howRow={10}>
          </DataTable>
        </div>
        <Modal ref="modal">
          <ModalHeader>
            <h4 className="modal-title">{this.state.text}</h4>
          </ModalHeader>
          <ModalBody>
            <Form className="form" ref="form" action="system/role/form.json" data={this.state.formData}
                  rules={this.rules} onChange={this.handleFormChange} onSuccess={this.handleFormSuccess}>
              <FormItem style={{display: 'none'}} name="userId">
                <FormInput></FormInput>
              </FormItem>
              <FormItem label="姓名" required name="realName" help="20个字以内">
                <FormInput placeholder="请输入姓名" style={{width: '350px'}}></FormInput>
              </FormItem>
              <FormItem label="用户名" required name="userName" help="20个字以内">
                <FormInput placeholder="请输入用户名" disabled={this.state.edit} style={{width: '350px'}}></FormInput>
              </FormItem>
              <FormItem label="密码" required name="password" help="20个字以内" style={styleInput}>
                <FormInput placeholder="请输入密码" type="password" style={{width: '350px'}}></FormInput>
              </FormItem>
              <FormItem ref="selectItem" label="部门" required name="deptId">
                <Select value={this.state.formData.deptId} url="system/user/selectUrl.json"
                        defaultOption={<Option value="">请选择</Option>} render={render}
                        onChange={this.handleFormSelect}/>
              </FormItem>
              <FormItem ref="checkBoxItem" label="角色" required name="roles">
                <Fetch  url="system/user/check.json" onSuccess={this.handleCheckSuccess}>
                  <CheckboxGroup selects={this.state.formData.roles} onChange={this.handleFormCheckBox}>
                    {
                      this.state.checkData.length > 0 ?
                        this.state.checkData.map(
                          (item, i) => {
                            if (this.state.userBig) {
                             return  <Checkbox key={i} value={item.roleId}>{item.roleName}</Checkbox>
                            } else {
                              return item.roleId !== 1 ? <Checkbox key={i} value={item.roleId}>{item.roleName}</Checkbox> : null
                            }
                          }) : null
                    }
                  </CheckboxGroup>
                </Fetch>
              </FormItem>
              <FormItem label="状态" required name="status" style={styleRadio}>
                <RadioGroup value={this.state.formData.status} onChange={this.handleFormRadio}>
                  <Radio value="0">冻结</Radio>
                  <Radio value="1">激活</Radio>
                </RadioGroup>
              </FormItem>
              <div style={{textAlign: 'center'}}>
                <button type="button" className="btn btn-primary" onClick={this.handleFormSave}>{this.state.buttonText}</button>
                <button type="button" style={{marginLeft: '20px'}} className="btn btn-default" onClick={this.handleFormClose}>取消</button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    )
  }
})