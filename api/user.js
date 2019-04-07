const express = require('express');
const router = express.Router();
const utils = require('utility')
const User = require('../models/user');
// 获取用户列表
router.get('/list', function (req, res, next) {
    User.find({}, function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            res.json({
                status: '0',
                msg: 'success',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});
// 获取用户信息
router.get('/userinfo', function (req, res, next) {
    const { user_id } = req.cookies;
    console.log( user_id );
    if (!user_id) {
        return res.json({
            status: '0',
            msg: '用户未登录',
            result: {
                is_login: false
            }
        })
    }
    User.findOne({ _id: user_id }, function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            res.cookie('user_id', doc._id);
            let result = {
                _id: doc._id,
                user_name: doc.user_name,
                __v: doc.__v,
                is_login: true
            }
            return res.json({
                status: '0',
                msg: '已登录',
                result: result
            })
        }

    })
});
// 注册用户
router.post('/regist', function (req, res, next) {
    const { user_name, user_pwd } = req.body;
    User.findOne({ user_name }, function (err, doc) {
        if (doc) {
            return res.json({
                status: '0',
                msg: '用户名重复',
                result: {
                    regist_status:'faild'
                }
            })
        }
        const userModel = new User({
            user_name,
            user_pwd: md5Pwd(user_pwd)
        });
        userModel.save(function (err, doc) {
            if (err) {
                return res.json({
                    status: '1',
                    msg: '注册失败，服务端出现错误',
                    result: {}
                })
            }
            return res.json({
                status: '0',
                msg: '注册成功',
                result: {
                    regist_status:'success',
                    user_name:doc.user_name
                }
            })
        })
    })
})
// 登陆
router.post('/login', function (req, res) {
    const { user_name, user_pwd } = req.body
    User.findOne({ user_name, user_pwd: md5Pwd(user_pwd) }, function (err, doc) {
        if (!doc) {
            return res.json({
                status: '0',
                msg: '用户名或者密码错误',
                result: {
                    login_suceess:false
                }
            })
        }
        res.cookie('user_id', doc._id);
        let result = {
            _id: doc._id,
            user_name: doc.user_name,
            __v: doc.__v,
            login_suceess: true
        }
        return res.json({
            status: '0',
            msg: '登陆成功',
            result: result
        })
    })
})
// 登出
router.post('/logout', function (req, res) {
    res.cookie('user_id', '')
    return res.json({
        status: '0',
        msg: '退出成功',
        result: {
            is_login: false
        }
    })
})

function md5Pwd(pwd) {
    const confuse = 'vue_echart_config_tool_!@#$';
    return utils.md5(utils.md5(pwd + confuse));
}
module.exports = router;