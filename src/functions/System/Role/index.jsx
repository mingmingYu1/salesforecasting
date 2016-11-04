import React from 'react'
import Fetch from 'bfd-ui/lib/Fetch'
import { Link } from 'react-router'
import xhr from 'bfd-ui/lib/xhr'
import DataTable from 'bfd-ui/lib/DataTable'
import { Modal, ModalHeader, ModalBody } from 'bfd-ui/lib/Modal'
import confirm from 'bfd-ui/lib/confirm'
import message from 'bfd-ui/lib/message'
import { Form, FormItem } from 'bfd-ui/lib/Form2'
import FormInput from 'bfd-ui/lib/FormInput'
import SelectTree from 'bfd-ui/lib/Tree/SelectTree'
import './index.less'

export default React.createClass({

  getInitialState() {

    //    验证
    this.rules ={
      roleName(v) {
        if(!v) {return '角色名称不可为空！'}
        if(v.length > 20) {return '角色名称不可大于20个字符！'}
      },
      menus(v) {
        if(!v || v.length === 0) {return '权限不可为空！'}
      }
    }

    return {
      tableUrl: 'system/role/tableUrl.json',        //     /role/query
      column: [
        {
          title:'角色名称',
          key:'roleName',
          width: '15%'
        },{
          title:'拥有权限',
          key:'menus',
          width: '70%',
          render: (text, item) => {
            return <span title={text}>{text}</span>
          }
        },{
          title:'操作',
          width: '15%',
          render: (item, component)=> {
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
      treeData: [],             //     树的接口   /menu/queryByRole
      formData: {
        menus: this.arrId
      }
    }
  },

  //  增
  handleClickAdd() {
    this.refs.modal.open()
    this.setState({
      buttonText: '创建',
      text: '新增',
      treeUrl: 'system/role/treeAdd.json',              //    /menu/queryByRole
      treeData: [],
      formData: {}
    })
  },

  //  删
  handleClickRemove(item){
    confirm('您确认要删除该角色吗？', () => {
      this.removeAjax(item.roleId)
    })
  },

  //  删除请求
  removeAjax(roleId) {
    xhr({
      type: 'get',    //  POST
      url: 'system/user/remove.json?roleId='+roleId,         //   /role/deleteRole
      // data: {roleId: roleId},
      success: this.handleRemoveSuccess
    })
  },

  //  删除成功回调
  handleRemoveSuccess(res) {
    if (res.code === 201) {
      message.success(res.message, 2)
      this.setState({tableUrl: 'system/role/tableUrl.json?time='+new Date()})        //     /role/query
    } else {
      message.danger(res.message)
    }
  },

  //  改
  handleClickEdit(item) {
    this.refs.modal.open()
    this.setState({
      text: '编辑',
      buttonText: '保存',
      treeUrl: 'system/role/treeEdit.json?roleId='+item.roleId,            //    /menu/queryByRole
      treeData: [],
      formData: {
        roleName: item.roleName,
        roleId: String(item.roleId)
      }
    })
  },

  //  表单改变
  handleFormChange() {},

  // 表单成功回调
  handleSuccess(res) {
    if (res.code === 201) {
      this.refs.modal.close();
      message.success(res.message, 2)
      this.setState({tableUrl: 'system/role/tableUrl.json?time='+new Date()})     //   //     /role/query
    } else {
      message.danger(res.message)
    }
  },

  //  表单提交按钮
  handleSave() {
    console.log(this.state.formData)
    this.refs.form.validate(this.state)
    this.refs.form.save()
  },

  //  取消按钮
  handleFormClose() {
    this.refs.modal.close()
  },

  //  获取选中tree的Id
  forTree(data) {
    let length = data.length
    for(let i = 0; i < length; i++) {
      if(data[i].checked) {
        this.arrId.push(data[i].menuId)
      }
      if (data[i].children && data[i].children.length > 0) {
        this.forTree(data[i].children)
      }
    }
  },

  //   树的选择
  handleChangeTree(treeData) {
    debugger
    this.arrId = []
    this.forTree(treeData)
    this.refs.tree.validate(this.arrId)
    const formData = this.state.formData
    formData.menus = this.arrId
    this.setState({treeData: treeData, formData: formData})
  },

  //  tree加载成功回调
  handleTreeSuccess(treeData) {
    this.arrId = []
    this.forTree(treeData)
    const formData = this.state.formData
    formData.menus = this.arrId
    this.setState({treeData: treeData, formData: formData})
  },

  onPageChange() {},

  render() {
    return (
      <div className="function-role">
        <div className="link"><Link to={'/system'}>系统管理</Link> > <span>角色管理</span></div>
        <button className='btn btn-primary marginTop' onClick={this.handleClickAdd}>
          <sapn className='glyphicon glyphicon-plus'></sapn>&nbsp;&nbsp;新增
        </button>
        <div className='marginTop tableContainer'>
          <DataTable url={this.state.tableUrl} onPageChange={this.onPageChange} showPage="true" column={this.state.column} howRow={10}></DataTable>
        </div>
        <Modal ref="modal">
          <ModalHeader>
            <h4 className="modal-title">{this.state.text}</h4>
          </ModalHeader>
          <ModalBody>
            <Form ref="form" action="system/role/form.json" data={this.state.formData} rules={this.rules} onChange={this.handleFormChange} onSuccess={this.handleSuccess}>
              <FormItem style={{display: 'none'}} name="roleId">
                <FormInput></FormInput>
              </FormItem>
              <FormItem label="角色名称" required name="roleName" help="20个字以内">
                <FormInput placeholder="请输入角色名称" style={{width: '350px'}}></FormInput>
              </FormItem>
              <FormItem ref="tree" label="权限" name="menus">
                <div className="treeContainer">
                  <Fetch  url={this.state.treeUrl} onSuccess={this.handleTreeSuccess}>
                    <SelectTree data={this.state.treeData} onChange={this.handleChangeTree}/>
                  </Fetch>
                </div>
              </FormItem>
              <div style={{textAlign: 'center'}}>
                <button type="button" className="btn btn-primary" onClick={this.handleSave}>{this.state.buttonText}</button>
                <button type="button" style={{marginLeft: '20px'}} className="btn btn-default" onClick={this.handleFormClose}>取消</button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    )
  }
})