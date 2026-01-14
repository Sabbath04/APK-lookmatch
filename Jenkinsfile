pipeline {
  agent { label 'frontangular' }
  environment {
    IMAGE_NAME = "stdevsec/loginunificado-front"
    CONTAINER_NAME = "loginunificado-front"
    HOST_PORT = "4200"
    CONTAINER_PORT = "8080"
  }
  stages {
    stage('START PIPELINE') {
      steps {
        echo '================ INICIO DEL PIPELINE ================'
      }
    }
    stage('Install') {
      steps {
        echo '================ INSTALANDO DEPENDENCIAS ================'
        sh 'npm install --legacy-peer-deps'
      }
    }
    stage('Build') {
      steps {
        echo '================ INICIANDO BUILD ================'
        sh 'npm run build -- --configuration production'
        echo '================ BUILD FINALIZADO ================'
      }
    }
    stage('Docker Build & Push') {
      steps {
        echo '================ DOCKER BUILD & PUSH ================'
        echo 'Eliminando contenedor previo (si existe)...'
        sh 'docker rm -f $CONTAINER_NAME || true'
        echo 'Contenedor previo eliminado.'
        echo 'Verificando si existe la imagen previa...'
        sh 'docker images -q $IMAGE_NAME:latest | xargs -r docker rmi -f'
        echo 'Imagen previa eliminada (si existía).'
        sh 'docker build -t $IMAGE_NAME:latest .'
        // sh 'docker push $IMAGE_NAME:latest' // Descomenta si tienes login en DockerHub
        echo '================ DOCKER BUILD & PUSH FINALIZADO ================'
      }
    }
    stage('Deploy') {
      steps {
        echo '================ INICIANDO DEPLOY ================'
        sh 'docker rm -f $CONTAINER_NAME || true'
        sh 'docker run -d --restart unless-stopped -p $HOST_PORT:$CONTAINER_PORT --name $CONTAINER_NAME $IMAGE_NAME:latest'
        echo '================ DEPLOY FINALIZADO ================'
      }
    }
    stage('END PIPELINE') {
      steps {
        echo '================ FIN DEL PIPELINE ================'
      }
    }
  }
}
