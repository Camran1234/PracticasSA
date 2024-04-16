
region = "us-east1"
zone =   "us-east1-b"
project = "halogen-parser-420423"
machine_type = "e2-standard-2"
image = "ubuntu-os-cloud/ubuntu-2004-lts"
gce_ssh_user = "pharaox"
gce_ssh_pub_key_file ="~/.ssh/google_compute_engine.pub"
gce_ssh_pv_key_file = "~/.ssh/google_compute_engine"
gce_service_account = "~/.ssh/camran_practicasa.json"

tags = ["worker1", "worker2"]
num = 2




