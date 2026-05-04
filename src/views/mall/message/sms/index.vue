<template>
  <message-center-page
    title="短信消息中心"
    description="这里先把模板管理和发送记录都接上，方便我们联调消息配置、发送结果和后台权限。"
    :template-config="templateConfig"
    :log-config="logConfig"
  />
</template>

<script>
import MessageCenterPage from "@/views/mall/message/MessageCenterPage"
import { messageCrudConfigs, messageLogConfigs } from "@/views/mall/common/crudConfigs"

export default {
  name: "MallSmsPage",
  components: {
    MessageCenterPage
  },
  data() {
    return {
      templateConfig: messageCrudConfigs.smsTemplate,
      logConfig: messageLogConfigs.sms
    }
  }
}
</script>
