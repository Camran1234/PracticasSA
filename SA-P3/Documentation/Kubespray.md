## Create VPC Network
gcloud compute networks create kubernetes-the-kubespray-way --subnet-mode custom
## Create Net of VPC Network
gcloud compute networks subnets create kubernetes \
  --network kubernetes-the-kubespray-way \
  --range 10.240.0.0/24
## Create firewall rules internal
gcloud compute firewall-rules create kubernetes-the-kubespray-way-allow-internal \
  --allow tcp,udp,icmp,udp:8472 \
  --network kubernetes-the-kubespray-way \
  --source-ranges 10.240.0.0/24
## Create firewall rules external
gcloud compute firewall-rules create kubernetes-the-kubespray-way-allow-external \
  --allow tcp:80,tcp:6443,tcp:443,tcp:22,icmp \
  --network kubernetes-the-kubespray-way \
  --source-ranges 0.0.0.0/0

## Create control panel instances
for i in 0 1 2; do
  gcloud compute instances create controller-${i} \
    --async \
    --boot-disk-size 200GB \
    --can-ip-forward \
    --image-family ubuntu-2004-lts \
    --image-project ubuntu-os-cloud \
    --machine-type e2-standard-2 \
    --private-network-ip 10.240.0.1${i} \
    --scopes compute-rw,storage-ro,service-management,service-control,logging-write,monitoring \
    --subnet kubernetes \
    --tags kubernetes-the-kubespray-way,controller
done

## Create worker instances
for i in 0 1 2; do
  gcloud compute instances create worker-${i} \
    --async \
    --boot-disk-size 200GB \
    --can-ip-forward \
    --image-family ubuntu-2004-lts \
    --image-project ubuntu-os-cloud \
    --machine-type e2-standard-2 \
    --private-network-ip 10.240.0.2${i} \
    --scopes compute-rw,storage-ro,service-management,service-control,logging-write,monitoring \
    --subnet kubernetes \
    --tags kubernetes-the-kubespray-way,worker
done

## List instances
gcloud compute instances list --filter="tags.items=kubernetes-the-kubespray-way"

## Stablish ssh key, if you have one
gcloud compute ssh worker-0
gcloud compute ssh worker-1
gcloud compute ssh worker-2
gcloud compute ssh controller-0
gcloud compute ssh controller-1
gcloud compute ssh controller-2
## Test it 
IP_CONTROLLER_0=$(gcloud compute instances list  --filter="tags.items=kubernetes-the-kubespray-way AND name:controller-0" --format="value(EXTERNAL_IP)")
USERNAME=$(whoami)
ssh $USERNAME@$IP_CONTROLLER_0
## In your local Machine
python3 -m venv venv
source venv/bin/activate
## git clone kubespray
git clone https://github.com/kubernetes-sigs/kubespray.git
cd kubespray
git checkout release-2.17
## Install requirements
pip install -r requirements.txt
## Create cluster
cp -rfp inventory/sample inventory/mycluster
## Declare Ips
declare -a IPS=($(gcloud compute instances list --filter="tags.items=kubernetes-the-kubespray-way" --format="value(EXTERNAL_IP)"  | tr '\n' ' '))
CONFIG_FILE=inventory/mycluster/hosts.yaml python3 contrib/inventory_builder/inventory.py ${IPS[@]}
## Change files
## Try ping
ansible -i inventory/mycluster/hosts.yaml -m ping all --key-file "~/.ssh/google_compute_engine"

## Execute it 

ansible-playbook -i inventory/mycluster/hosts.yaml --become --user=pharaox --become-user=root reset.yml --key-file "~/.ssh/google_compute_engine"

ansible-playbook -i inventory/mycluster/hosts.yaml --become --user=pharaox --become-user=root cluster.yml --key-file "~/.ssh/google_compute_engine"

## If error
ansible-playbook -i inventory/mycluster/hosts.yaml --become --user=pharaox --become-user=root reset.yml -e ansible_python_interpreter=/usr/bin/python3 --key-file "~/.ssh/google_compute_engine"

ansible-playbook -i inventory/mycluster/hosts.yaml --become --user=pharaox --become-user=root cluster.yml -e ansible_python_interpreter=/usr/bin/python3 --key-file "~/.ssh/google_compute_engine"

## Proceed to a master node and then create a kubectl handler
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

## Or for local kubectl do
ssh $USERNAME@$IP_CONTROLLER_0
USERNAME=$(whoami)
sudo chown -R $USERNAME:$USERNAME /etc/kubernetes/admin.conf
exit

scp $USERNAME@$IP_CONTROLLER_0:/etc/kubernetes/admin.conf kubespray-do.conf
##Change the localhost ip to the external IP
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: XXX
    server: https://35.205.205.80:6443
  name: cluster.local
...
## Then export the config kubectl
export KUBECONFIG=$PWD/kubespray-do.conf

# ELK INSTALLATION

## INSTALL ECK
kubectl create -f https://download.elastic.co/downloads/eck/2.12.1/crds.yaml

## INSTALL RBAC rules
kubectl apply -f https://download.elastic.co/downloads/eck/2.12.1/operator.yaml

## INSTALL storageClass
kubectl apply -f storageClass.yaml

## INSTALL peristentVolumes
kubectl apply -f persistentVolume.yaml

## INSTALL elasticsearch
kubectl apply -f elasticsearch.yaml

## INSTALL logstash
kubectl apply -f logstash.yaml

## INSTALL kibana
kubectl apply -f kibana.yaml

