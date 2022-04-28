import NavBar from '@/components/NavBar'
import styles from './index.module.scss'
import Input from '@/components/input'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import classnames from 'classnames'
import { useDispatch } from 'react-redux'
import { login, sendCode } from '@/store/actions/login'
import { Toast } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Login() {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const [time, setTime] = useState(0)
  // 获取验证码
  const onExtraClick = async () => {
    if (time > 0) return
    // 先对手机号进行验证
    if (!/^1[3-9]\d{9}$/.test(mobile)) {
      // 点击验证码触发手机号验证
      formik.setTouched({ mobile: true })
      return
    }
    await dispatch(sendCode(mobile))
    Toast.success('获取验证码成功', 1)

    // 开启倒计时
    setTime(60)
    let timeId = setInterval(() => {
      setTime((time) => {
        if (time === 1) {
          clearInterval(timeId)
        }
        return time - 1
      })
    }, 1000)
  }

  const formik = useFormik({
    initialValues: {
      mobile: '17634206200',
      code: '246810',
    },
    // 表单提交时触发
    onSubmit: async (values) => {
      await dispatch(login(values))
      Toast.success('登陆成功', 1)
      // 跳转到登录页
      // console.log(location)
      if (location.state?.from) {
        history.replace(location.state.from)
      } else {
        history.replace('/home')
      }
    },
    // yup校验
    validationSchema: Yup.object({
      // 手机号验证规则
      mobile: Yup.string()
        .required('请输入手机号')
        .matches(/^1[3-9]\d{9}$/, '手机号格式错误'),
      code: Yup.string()
        .required('验证码不能为空')
        .matches(/^\d{6}$/, '验证码格式错误'),
    }),
  })
  const {
    values: { mobile, code },
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    touched,
    // 是否校验通过
    isValid,
  } = formik

  return (
    <div className={styles.root}>
      {/* 标题 */}
      <NavBar>登录</NavBar>
      {/* 内容 */}
      <div className="content">
        <h3>短信登录</h3>
        <form onSubmit={handleSubmit}>
          {/* 手机号输入框 */}
          <div className="input-item">
            <Input
              name="mobile"
              placeholder="请输入手机号"
              value={mobile}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength="11"
            ></Input>
            {touched.mobile && errors.mobile ? (
              <div className="validate">{errors.mobile}</div>
            ) : null}
          </div>

          {/* 短信验证码输入框 */}
          <div className="input-item">
            <Input
              name="code"
              placeholder="请输入验证码"
              extra={time === 0 ? '获取验证码' : time + 's后获取'}
              onExtraClick={onExtraClick}
              value={code}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength="6"
            ></Input>
            {touched.code && errors.code ? (
              <div className="validate">{errors.code}</div>
            ) : null}
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            className={classnames('login-btn', { disabled: !isValid })}
            disabled={!isValid}
          >
            登录
          </button>
        </form>
      </div>
    </div>
  )
}

//
//
// formik例子
// import React from 'react';
// import { useFormik } from 'formik';

// const SignupForm = () => {
//   // Pass the useFormik() hook initial form values and a submit function that will
//   // be called when the form is submitted
//   const formik = useFormik({
//     initialValues: {
//       email: '',
//     },
//     onSubmit: values => {
//       alert(JSON.stringify(values, null, 2));
//     },
//   });
//   return (
//     <form onSubmit={formik.handleSubmit}>
//       <label htmlFor="email">Email Address</label>
//       <input
//         id="email"
//         name="email"
//         type="email"
//         onChange={formik.handleChange}
//         value={formik.values.email}
//       />

//       <button type="submit">Submit</button>
//     </form>
//   );
// };
