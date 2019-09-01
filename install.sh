#!/bin/bash
# OS:
# 1. Install ansible
# 2. Install kubespray
# 3. Install helm
# 4. schedule mongodb replicaset
# 5. schedule taxi-ingester
# 6. schedule taxi-counter
# 7. schedule taxi-app
# 8. curl

function install_deps() {
    echo "Installing OS dependencies: "
    sudo apt-get -qq update -y
    sudo apt-get -qq -y -o Dpkg::Use-Pty=0  install python-minimal software-properties-common python python-pip sshpass apt-transport-https ca-certificates python-dev libffi-dev libssl-dev -y
    sudo -H pip -q install pip setuptools pyopenssl ndg-httpsclient pyasn1 ansible netaddr Jinja2 --upgrade
    echo "Done."
}

function install_cluster() {
    echo "Installing Kubernetes cluster: "
    git clone https://github.com/kubernetes-sigs/kubespray ~/kubespray
    ansible-playbook -i ~/kubespray/inventory/local/hosts.ini --become --become-user=root ~/kubespray/cluster.yml
    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config
    echo 'source <(kubectl completion bash)' >>~/.bashrc
    echo "Done."
}

function install_helm() {
    echo "Installing Helm and Tiller: "
    curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > install-helm.sh
    chmod u+x install-helm.sh
    ./install-helm.sh
    kubectl -n kube-system create serviceaccount tiller
    kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller
    helm init --service-account tiller
    echo "Done."
}

function start_mongodb() {
    echo "Starting MongoDB ReplicaSet: "
    kubectl create secret generic keyfilesecret --from-file=db/key.txt
    kubectl create -f db/mongodb-secrets.yml
    kubectl -n kube-system wait --for=condition=Ready pod -l name=tiller --timeout=60s
    helm install --name mongo -f db/mongodb-values.yml stable/mongodb-replicaset
    kubectl wait --for=condition=Ready pod -l app=mongodb-replicaset --timeout=300s
    echo "Done."
}

function start_apps() {
    for app in ingester counter app
    do
        helm install --name taxi-${app} ${app}/chart
    done
    kubectl wait --for=condition=Ready pod -l app.kubernetes.io/name=taxi-app --timeout=50s
    echo "Query taxi metrics with: curl \$(kubectl get svc | grep taxi-app | awk '{print \$3}')/metrics"
    curl $(kubectl get svc | grep taxi-app | awk '{print $3}')/metrics
}

install_deps
install_cluster
install_helm
start_mongodb
start_apps
