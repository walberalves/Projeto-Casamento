document.addEventListener("DOMContentLoaded", function() {
  const preview = document.getElementById("preview");
  const capturePhotoBtn = document.getElementById("capturePhotoBtn");
  const captureVideoBtn = document.getElementById("captureVideoBtn");
  const messageInput = document.getElementById("messageInput");
  const submitButton = document.getElementById("submitButton");
  let stream;
  let mediaRecorder;
  let chunks = [];

  // Função para iniciar a câmera
  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      preview.innerHTML = "<video id='videoElement' autoplay muted></video>";
      const videoElement = document.getElementById("videoElement");
      videoElement.srcObject = stream;
    } catch (err) {
      console.error("Erro ao iniciar a câmera: ", err);
    }
  }

  // Função para capturar foto
  function capturePhoto() {
    const canvas = document.createElement("canvas");
    const videoElement = document.getElementById("videoElement");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const photoData = canvas.toDataURL("image/jpeg");
    preview.innerHTML = "<img src='" + photoData + "' id='photoPreview'>";
    stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  // Função para iniciar a gravação de vídeo
  function startRecording() {
    chunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = function(e) {
      chunks.push(e.data);
    };
    mediaRecorder.onstop = function() {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(blob);
      preview.innerHTML = "<video controls src='" + videoUrl + "' id='videoPreview'></video>";
      stream.getTracks().forEach(track => {
        track.stop();
      });
    };
    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
    }, 120000); // 2 minutos
  }

  // Event listener para o botão de capturar foto
  capturePhotoBtn.addEventListener("click", capturePhoto);

  // Event listener para o botão de capturar vídeo
  captureVideoBtn.addEventListener("click", startRecording);

  // Event listener para o botão de enviar mensagem
  submitButton.addEventListener("click", function() {
    const message = messageInput.value;
    const photoPreview = document.getElementById("photoPreview");
    const videoPreview = document.getElementById("videoPreview");
    let data = {
      message: message
    };
    if (photoPreview) {
      data.photo = photoPreview.src;
    }
    if (videoPreview) {
      data.video = videoPreview.src;
    }
    console.log("Dados a serem enviados:", data);
    // dados a serem enviados via ajax ou etc
    console.log("Mensagem enviada:", data.message);
    if (data.photo) {
      console.log("Foto enviada:", data.photo);
    }
    if (data.video) {
      console.log("Vídeo enviado:", data.video);
    }
    // Limpa o campo de mensagem
    messageInput.value = "";
  });

  // Inicia a câmera quando a página é carregada
  startCamera();
});
