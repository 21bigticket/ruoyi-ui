<template>
  <message-center-page
    title="微信消息中心"
    description="模板配置和发送日志放在一页，后面要接真实微信通道时，也能直接在这里做联调回看。"
    :template-config="templateConfig"
    :log-config="logConfig"
  />
</template>

<script>
import MessageCenterPage from "@/views/mall/message/MessageCenterPage"
import { messageCrudConfigs, messageLogConfigs } from "@/views/mall/common/crudConfigs"

export default {
  name: "MallWeixinPage",
  components: {
    MessageCenterPage
  },
  data() {
    return {
      templateConfig: messageCrudConfigs.weixinTemplate,
      logConfig: messageLogConfigs.weixin
    }
  }
}
</script>
