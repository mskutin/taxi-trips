# **Take-home challenge**

## Machine Learning Infrastructure

The goal of this exercise is to provide a realistic example of the kind of work we do and evaluate your ability to do such work. This exercise should require about eight hours of your time.

Please reach out to us if you have any questions! When done, please follow the submission instructions and send your submission via email.

### Problem statement

We would like you to build a Web Service that provides basic metrics over taxi data. The live data can be obtained from [Pub/Sub](https://cloud.google.com/pubsub/) at projects/pubsub-public-data/topics/taxirides-realtime. You will need to provide a simple Web service that returns the **total number of trips** in the **past one hour**. There will be no parameters for this web service.

You will need to deploy your service and dependencies on a distributed cluster of your choice. Each service you use should be running in Docker. We will be testing your deployment on a bare Ubuntu VM, so you should provide a single script (e.g., Shell or Vagrant) to set up the cluster and your services.

If you use a shell script, it should be called install.sh and it will be invoked with sudo ./install.sh from the home directory of the default user. You may let us know if your script requires additional parameters.

### Other considerations

- We prefer Kubernetes, but you may consider Docker Swarm, Mesos, etc.
- Your entire system should run on Ubuntu 16.04 LTS Server. We will test using a VM with 20GB of storage, 8GB of RAM, and 4 cores, but if you need more to run, please let us know.
- The Web service should be accessible within the test VM.
- There is no need to consider data more than one hour old.
- It should be possible to complete this assignment within GCP&#39;s free tier.

### Evaluation

- Please include a short motivation on major design and technology decisions you have made.
- The details of the Web service request (e.g., the path could be at the root &quot;/&quot;) and the response (e.g., YAML vs JSON vs XML, field names, etc) are not too important for the purposes of this evaluation.
- Please provide your git history. You can do this via [git-bundle](https://git-scm.com/book/en/v2/Git-Tools-Bundling). We will be taking a look at your git history, so please keep it tidy and descriptive. Do NOT share your code, Docker images, or other artifacts on a **public** repo.
- You can use any language and libraries you please. Please include all your code, including code for the Web service, Dockerfiles, shell scripts, etc that you wrote for this assignment. If you&#39;re using third-party code or scripts, please clearly attribute them (or use git submodules).
- You may use external services for deployment (e.g., Docker Hub, Google Container Registry), but your running system should not depend on externally hosted services, e.g., you should not use Google DataProc or AWS DynamoDB.
- Your solution should be robust enough to survive the loss of up to **two** Docker instances simultaneously, while still yielding correct responses.
- Performance and scalability of the overall architecture are important. However, we will not be too particular about the performance of the web service code itself.
