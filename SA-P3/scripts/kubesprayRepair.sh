ansible-playbook -i inventory/dev/hosts.yaml --become --user=pharaox --become-user=root reset.yml -e ansible_python_interpreter=/usr/bin/python3 --key-file "~/google_compute_engine"

ansible-playbook -i inventory/mycluster/hosts.yaml --become --user=pharaox --become-user=root cluster.yml -e ansible_python_interpreter=/usr/bin/python3 --key-file "~/google_compute_engine"