import React from 'react'
import styles from './Landing.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const Landing = () => (
  <div className={cx('landing')}>
    <h1 className={cx('lg-heading')}>
        Nomad
        <span className={cx('text-secondary')}>Yong</span>
    </h1>
    <h2 className={cx('sm-heading')}>
        Web Developer, Programmer, Designer &
        Univ. student
    </h2>
    <div className={cx('icons')}>
        <Link to="http://dev-yong.tistory.com/">
            <i className={cx('fab fa-blogger fa-2x')}></i>
        </Link>
        <Link to="https://www.facebook.com/profile.php?id=100000467400701">
            <i className={cx('fab fa-facebook fa-2x')}></i>
        </Link>
        <Link to="https://www.instagram.com/yongn14/">
            <i className={cx('fab fa-instagram fa-2x')}></i>
        </Link>
        <Link to="https://github.com/nomad-yong">
            <i className={cx('fab fa-github fa-2x')}></i>
        </Link>
    </div>

    <div className={cx('wise-saying')}>
            Life happens while
                you making other plans. <br />
                - John Lennon -
    </div>
  </div>

);

export default Landing;