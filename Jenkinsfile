node(){
  stage('Cloning Git') {
    checkout scm
  }
  
  stage('Package') {
    sh "tar -zcvf bundle.tar.gz"
  }
  
  stage('Artifacts Creation'){
    fingerprint 'bundle.tar.gz'
    archiveArtifacts 'bundle.tar.gz'
    echo "Artifacts Created"
  }
  
  stage('Stash changes'){
    stash allowEmpty: true, includes: 'bundle.tar.gz', name: 'buildArtifacts'
  }
}

node('ivysnodebe'){
  echo 'Unstash'
  unstash 'buildArtifacts'
  echo 'Artifacts copied'
  
  echo 'Copy'
}
