import NavBar from '@/components/NavBar'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { List, DatePicker, Drawer, Toast, Modal } from 'antd-mobile'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, updatePhoto, updateProfile } from '@/store/actions/profile'
import classnames from 'classnames'
import EditInput from './components/EditInput'
import EditList from './components/EditList'
import dayjs from 'dayjs'
import { logout } from '@/store/actions/login'
import { useHistory } from 'react-router-dom'
const Item = List.Item

export default function ProfileEdit() {
  const history = useHistory()
  const fileRef = useRef(null)
  const dispatch = useDispatch()
  const [open, setOpen] = useState({
    visible: false,
    type: '',
  })

  // 控制列表抽屉
  const [listOpen, setListOpen] = useState({
    visible: false,
    // photo gender
    type: '',
  })

  const config = {
    photo: [
      {
        title: '拍照',
        onClick: () => {
          console.log('拍照')
        },
      },
      {
        title: '本地选择',
        onClick: () => {
          fileRef.current.click()
        },
      },
    ],
    gender: [
      {
        title: '男',
        onClick: () => {
          onCommit('gender', 0)
        },
      },
      {
        title: '女',
        onClick: () => {
          onCommit('gender', 1)
        },
      },
    ],
  }

  const onClose = () => {
    setOpen({
      visible: false,
      type: '',
    })
    setListOpen({
      visible: false,
      type: '',
    })
  }
  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  const onCommit = async (type, value) => {
    await dispatch(updateProfile({ [type]: value }))
    Toast.success('修改成功', 1)
    onClose()
  }

  const onFileChange = async (e) => {
    const file = e.target.files[0]
    // 上传文件  使用formData
    const formData = new FormData()
    formData.append('photo', file)
    await dispatch(updatePhoto(formData))
    Toast.success('修改成功')
    onClose()
  }

  const onBirthChange = (e) => {
    onCommit('birthday', dayjs(e).format('YYYY-MM-DD'))
  }

  const logOut = () => {
    // 显示弹框
    Modal.alert('温馨提示', '确定要退出吗', [
      { text: '取消' },
      {
        text: '确定',
        style: { color: '#FC6627' },
        onPress() {
          // 删除token
          dispatch(logout())
          // 跳转到登录页
          history.push('/login')
          Toast.success('退出登录成功')
        },
      },
    ])
  }

  // 获取redux中profile数据
  const profile = useSelector((state) => state.profile.profile)
  // console.log(profile)
  return (
    <div className={styles.root}>
      <div className="content">
        {/* 顶部导航栏 */}
        <NavBar>个人信息</NavBar>

        <div className="wrapper">
          <List className="profile-list">
            <Item
              extra={
                <span className="avatar-wrapper">
                  <img src={profile.photo} alt="" />
                </span>
              }
              arrow="horizontal"
              onClick={() => {
                setListOpen({
                  visible: true,
                  type: 'photo',
                })
              }}
            >
              头像
            </Item>
            <Item
              extra={profile.name}
              arrow="horizontal"
              onClick={() => {
                setOpen({
                  visible: true,
                  type: 'name',
                })
              }}
            >
              昵称
            </Item>
            <Item
              extra={
                <span
                  className={classnames('intro', profile.intro ? 'normal' : '')}
                >
                  {profile.intro || '未填写'}
                </span>
              }
              arrow="horizontal"
              onClick={() => {
                setOpen({
                  visible: true,
                  type: 'intro',
                })
              }}
            >
              简介
            </Item>
          </List>

          <List className="profile-list">
            <Item
              extra={profile.gender === 0 ? '男' : '女'}
              arrow="horizontal"
              onClick={() => {
                setListOpen({
                  visible: true,
                  type: 'gender',
                })
              }}
            >
              性别
            </Item>
            <DatePicker
              mode="date"
              title="选择年月日"
              value={new Date(profile.birthday)}
              minDate={new Date(1900, 1, 1, 0, 0, 0)}
              maxDate={new Date()}
              onChange={onBirthChange}
            >
              <List.Item arrow="horizontal">生日</List.Item>
            </DatePicker>
          </List>
        </div>

        {/* 本地选择照片 */}
        <input type="file" hidden ref={fileRef} onChange={onFileChange} />

        {/* 底部栏：退出登录按钮 */}
        <div className="logout" onClick={logOut}>
          <button className="btn">退出登录</button>
        </div>
      </div>

      {/* 全屏表单抽屉 */}
      <Drawer
        position="right"
        className="drawer"
        children={''}
        open={open.visible}
        sidebar={
          open.visible && (
            <EditInput
              type={open.type}
              onClose={onClose}
              onCommit={onCommit}
            ></EditInput>
          )
        }
      />

      {/* 菜单列表抽屉 */}
      <Drawer
        position="bottom"
        className="drawer-list"
        children={''}
        sidebar={
          listOpen.visible && (
            <EditList
              config={config}
              onClose={onClose}
              type={listOpen.type}
            ></EditList>
          )
        }
        open={listOpen.visible}
        onOpenChange={onClose}
      />
    </div>
  )
}
