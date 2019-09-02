#!/bin/bash
PROJECT_ID=$1
INSTANCE_NAME=$2
REGION=asia-southeast1-a
IMAGE=ubuntu-1604-xenial-v20190816
gcloud beta compute --project=${PROJECT_ID} instances create ${INSTANCE_NAME} \
        --zone=${REGION} \
        --machine-type=custom-4-8192 \
        --subnet=default \
        --network-tier=PREMIUM \
        --no-restart-on-failure \
        --maintenance-policy=TERMINATE \
        --preemptible \
        --service-account=748234255418-compute@developer.gserviceaccount.com \
        --scopes=https://www.googleapis.com/auth/pubsub,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/trace.append,https://www.googleapis.com/auth/devstorage.read_only \
        --tags=http-server,https-server \
        --image=${IMAGE} \
        --image-project=ubuntu-os-cloud \
        --boot-disk-size=20GB \
        --boot-disk-type=pd-standard \
        --boot-disk-device-name=${INSTANCE_NAME} \
        --reservation-affinity=any
