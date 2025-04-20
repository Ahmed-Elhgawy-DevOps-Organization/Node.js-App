pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        IMAGE_NAME="elhgawy/node-app:${env.BUILD_ID}"
    }

    stages{
        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install --no-audit'
                }
            }
        }
        stage('Dependency Check') {
            steps {
                script {
                    sh 'npm audit --audit-level=high'
                }
            }
        }
        stage('Run Tests') {
            environment {
                SECRET_MESSAGE="This is a secret message!"
                USERNAME="admin"
                PASSWORD="password123"
            }
            steps {
                script {
                    sh 'npm test'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t node-app .'
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    sh "docker tag node-app ${IMAGE_NAME}"
                    withDockerRegistry(credentialsId: 'dockerhub') {
                        sh "docker push ${IMAGE_NAME}"
                    }
                }
            }
        }
        stage('Deploy to Production') {
            steps {
                script {
                    withAWS(credentials:'aws-jenkins-creds', region:'us-east-1') {
                        sshagent(['aws-private-key']) {
                            sh '''
                                instance_ip=$(aws ec2 describe-instances --query "Reservations[*].Instances[*].PublicDnsName" --output text)
                                ssh -o StrictHostKeyChecking=no ec2-user@$instance_ip "
                                    if docker ps | grep -q node-app;then
                                        docker stop node-app && docker rm node-app
                                    fi
                                    docker run -d -p 3000:3000 --name node-app -e USERNAME=admin -e PASSWORD=pass123 ${IMAGE_NAME}
                                "
                            '''
                        }
                    }
                }
            }
        }
    }
}