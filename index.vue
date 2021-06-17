<template>
  <div class="container" ref="container">
    <a
      href="/test.jpg"
      download="test.jpg"
      target="_blank"
      >jpg静态资源</a
    >
    <a
      href="/test.zip"
      download="test.zip"
      target="_blank"
      >zip静态资源</a
    >
    <a
      href="https://www.7-zip.org/a/7z1900-x64.exe"
      download="7z1900-x64.exe"
      target="_blank"
      >三方exe静态资源</a
    >
    <a
      href="/createQrCode?text=http://lxqnsys.com/"
      download
      target="_blank"
      >二维码流</a
    >
    <a
      href="/getFileStream?name=test.jpg"
      download
      target="_blank"
      >jpg流</a
    >
    <a
      href="/getFileStream?name=test.zip"
      download
      target="_blank"
      >zip流</a
    >
    <a
      href="/getAttachmentFileStream?name=test.jpg"
      download
      target="_blank"
      >附件jpg流</a
    >
    <a
      href="/getAttachmentFileStream?name=test.zip"
      download
      target="_blank"
      >附件zip流</a
    >
    <a :href="base64Img" download target="_blank">base64字符串</a>
    <a :href="canvasBase64Img" download target="_blank">canvas base64字符串</a>
    <a :href="blobData" download target="_blank">blob</a>
    <a :href="canvasBlobImg" download target="_blank">canvas blob</a>
    <el-button type="primary" @click="locationHrefDownload"
      >location.href下载</el-button
    >
    <el-button type="primary" @click="formType">from表单下载</el-button>
    <el-button type="primary" @click="iframeType">iframe下载</el-button>
    <img :src="base64Img" alt="" />
    <img :src="canvasBase64Img" alt="" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      base64Img: '',
      blobData: null,
      blobDataName: '',
      canvasBase64Img: '',
      canvasBlobImg: null
    }
  },
  async created () {
    this.base64Type()
    this.blobType()
    this.canvasType()
  },
  methods: {
    locationHrefDownload () {
      location.href =
        '/getAttachmentFileStream?name=test.jpg'
    },
    async base64Type () {
      let { data } = await axios.get(
        '/createBase64QrCode?text=http://lxqnsys.com/'
      )
      this.base64Img = data
    },
    async blobType () {
      let { data } = await axios.get(
        '/getAttachmentFileStream?name=test.jpg',
        {
          responseType: 'blob'
        }
      )
      const blobData = URL.createObjectURL(data)
      this.blobData = blobData
    },
    canvasType () {
      const img = new Image()
      img.setAttribute('crossOrigin', 'anonymous')
      img.onload = () => {
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)
        // data:协议
        let data = canvas.toDataURL()
        this.canvasBase64Img = data
        // blob:协议
        canvas.toBlob((blob) => {
          const blobData = URL.createObjectURL(blob)
          this.canvasBlobImg = blobData
        })
      }
      img.src = '/createQrCode?text=http://lxqnsys.com/'
    },
    formType () {
      const form = document.createElement('form')
      form.style.display = 'none'
      form.action = '/getAttachmentFileStream'
      form.method = 'post'
      form.target = '_blank'
      document.body.appendChild(form)
      const params = {
        name: 'test.jpg'
      }
      for (let key in params) {
        let input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = params[key]
        form.appendChild(input)
      }
      form.submit()
      form.remove()
    },
    iframeType () {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.onload = () => {
        iframe.contentWindow.document.execCommand('SaveAs')
        document.body.removeChild(iframe)
      }
      iframe.src = '/createQrCode?text=http://lxqnsys.com/'
      document.body.appendChild(iframe)
    }
  }
}
</script>

<style lang="less">
.container {
  width: 100%;
  height: 100%;

  a {
    display: block;
    margin: 10px;
  }
}
</style>
