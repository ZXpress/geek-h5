import classnames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import Icon from '../icon'
import styles from './index.module.scss'

/**
 * 拥有懒加载特性的图片组件
 * @param {String} props.src 图片地址
 * @param {String} props.className 样式类
 */
const Image = ({ src, className, alt }) => {
  // 记录图片加载是否出错的状态
  const [isError, setIsError] = useState(false)

  // 记录图片是否正在加载的状态
  const [isLoading, setIsLoading] = useState(true)

  // 对图片元素的引用
  const imgRef = useRef(null)

  useEffect(() => {
    // 监听图片
    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (isIntersecting) {
        imgRef.current.src = imgRef.current.dataset.src
        // 监听过后取消监听
        observer.unobserve(imgRef.current)
      }
    })
    observer.observe(imgRef.current)
  }, [])

  // 图片加载成功
  const onload = () => {
    setIsError(false)
    setIsLoading(false)
  }

  const onError = () => {
    setIsLoading(false)
    setIsError(true)
  }

  return (
    <div className={classnames(styles.root, className)}>
      {/* 正在加载时显示的内容 */}
      {isLoading && (
        <div className="image-icon">
          <Icon type="iconphoto" />
        </div>
      )}

      {/* 加载出错时显示的内容 */}
      {isError && (
        <div className="image-icon">
          <Icon type="iconphoto-fail" />
        </div>
      )}

      {/* 加载成功时显示的内容 */}
      {!isError && (
        <img
          alt={alt}
          data-src={src}
          ref={imgRef}
          onLoad={onload}
          onError={onError}
        />
      )}
    </div>
  )
}

export default Image
