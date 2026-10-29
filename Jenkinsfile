
pipeline {
    agent any

    options {
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Maven Build') {
            steps {
                bat 'mvn clean package'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t task-manager:latest .'
            }
        }

        stage('Load Image into Kubernetes') {
            steps {
                bat 'docker save task-manager:latest | docker exec -i desktop-control-plane ctr -n k8s.io images import -'
            }
        }

        stage('Kubernetes Deploy') {
            steps {
                bat '''
                    kubectl apply -f kubernetes\\deployment.yaml
                    kubectl apply -f kubernetes\\service.yaml
                    kubectl rollout restart deployment/task-manager-deployment
                    kubectl rollout status deployment/task-manager-deployment --timeout=180s
                '''
            }
        }

        stage('Verify') {
            steps {
                bat '''
                    kubectl get deployments
                    kubectl get pods
                    kubectl get services
                '''
            }
        }
    }

    post {
        success {
            echo 'Task Manager CI/CD Pipeline SUCCESS!'
        }
        failure {
            echo 'Pipeline FAILED. Check console output.'
        }
    }
}
