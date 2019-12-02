module.exports = function (options) {
  var self = this

  this.$el = options.el

  var $inputFile = this.$el.querySelector('#fileToUpload')
  var $selectedFile = this.$el.querySelector('#selectedFile')
  var $removeAttachment = $selectedFile.querySelector('#removeAttachment')

  this.fileSelected = function () {
    var file = $inputFile.files[0]
    var reader = new FileReader()

    if (file) {
      console.log('Reading file')
      $inputFile.classList.add('hidden')
      $selectedFile.classList.remove('hidden')
      $selectedFile.querySelector('#filename').innerText = file.name
      reader.readAsDataURL(file)
    }
    reader.onloadend = function () {
      if (file.size / 1024 / 1024 > 5) {
        console.log('Selected file too big (' + Math.round(file.size / 1024 / 1024) + 'MB -- max 5MB)')
        $selectedFile.querySelector('#filename').classList.toggle('error')
        $selectedFile.querySelector('#filename').innerText = 'File is too big, max 5MB'
        setTimeout(function () {
          $selectedFile.querySelector('#filename').classList.toggle('error')
          self.removeAttachment()
        }, 3000)
        return
      }
      self.filename = file.name
      self.contentType = reader.result.substring(5, reader.result.indexOf(';'))
      self.base64 = reader.result.substr(reader.result.indexOf(',') + 1)
    }
  }

  this.getObject = function () {
    if (!self.base64) return null

    return {
      filename: self.filename,
      contentType: self.contentType,
      base64: self.base64
    }
  }

  // Event listeners
  $inputFile.addEventListener('change', this.fileSelected)

  $removeAttachment.addEventListener('click', function () {
    self.removeAttachment()
  })

  this.removeAttachment = function () {
    $selectedFile.classList.add('hidden')
    $inputFile.classList.remove('hidden')
    $inputFile.value = ''
    self.base64 = null
    self.filename = null
    self.contentType = null
  }
}
