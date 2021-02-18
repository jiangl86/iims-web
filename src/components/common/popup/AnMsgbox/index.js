import { MessageBox } from 'element-ui';

export default {
    //各方法中options参数请具体参见element-ui
    msgbox(options) {
        MessageBox(options)
    },
    alert({ message, title, options }) {
        if (title) {
            MessageBox.alert(message, title, options)
        } else {
            MessageBox.alert(message, options)
        }
    },
    //返回promise
    confirm({ message, title, options }) {
        if (title) {
            return MessageBox.confirm(message, title, options)
        } else {
            return MessageBox.confirm(message, options)
        }
    },
    prompt({ message, title, options }) {
        if (title) {
            return MessageBox.prompt(message, title, options)
        } else {
            return MessageBox.prompt(message, options)
        }
    },
}