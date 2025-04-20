pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        IMAGE_NAME="elhgawy/node-app:${env.BUILD_ID}"
        DOCKER_HUB_CREDS = credentials('dockerhub')
        APP_CREDS = credentials('app-creds')
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
                USERNAME="${APP_CREDS_USR}"
                PASSWORD="${APP_CREDS_PSW}"
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
                    // login to Dockerhub
                    sh 'docker login -u ${DOCKER_HUB_CREDS_USR} -p ${DOCKER_HUB_CREDS_PSW}'
                    withAWS(credentials:'aws-jenkins-creds', region:'us-east-1') {
                        sshagent(['aws-private-key']) {
                            sh '''
                                instance_ip=$(aws ec2 describe-instances --query "Reservations[*].Instances[*].PublicDnsName" --output text)
                                ssh -o StrictHostKeyChecking=no ec2-user@$instance_ip "
                                    if docker ps | grep -q node-app;then
                                        docker stop node-app && docker rm node-app
                                    fi
                                    docker run -d -p 3000:3000 --name node-app -e USERNAME=${APP_CREDS_USR} -e PASSWORD=${APP_CREDS_PSW} ${IMAGE_NAME}
                                "
                            '''
                        }
                    }
                }
            }
        }
    }
}