<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://orcaworkflows.com">
    <img src="../orca/public/logo_simple.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Orca Workflows</h3>

  <p align="center">
    No-code data orchestration platform.
    <br />
    <a href="https://orcaworkflows.com"><strong>Explore»</strong></a>
    <br />
    <br />
    <a>
    This is OrcaWorkflows' charts directory. Please refer to below for
    other components.
    </a>
    <br />
    <a href="https://github.com/OrcaWorkflows/orca/service">Orca Service</a>
    |
    <a href="https://github.com/OrcaWorkflows/orca/operators">Orca Operators</a>
    |
    <a href="https://github.com/OrcaWorkflows/orca/orca">Orca</a>
    <br />
    <br />
    <a href="https://www.orcaworkflows.com/#about">View Demo</a>
    ·
    <a href="https://github.com/OrcaWorkflows/orca/issues">Report Bug</a>
    ·
    <a href="https://github.com/OrcaWorkflows/orca/issues">Request Feature</a>
  </p>
</div>

<!-- ABOUT THE CHARTS DIRECTORY -->
### About The Charts Directory

OrcaWorkflows runs on top of Kubernetes and the charts directory of OrcaWorkflows consists
several deployment/configuration files and scripts.


<!-- DEPLOYMENT -->
### Deploy OrcaWorkflows to Kubernetes

#### Quick Notes

* All operations will be executed on Kubernetes manager node (remote/local master node).
* Clone charts into Kubernetes manager node.

#### Prerequisites
* Define your Docker registry to Kubernetes. Please refer to [Pull an Image from a Private Registry](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)
* A running Argo Workflows application on Kubernetes cluster.

#### Setting Up
* Create new namespace named "argo".
```sh
  kubectl create namespace argo
```

#### Deploy PostgreSQL

This section does not cover how to deploy a PostgreSQL on Kubernetes.

Just make sure, you apply sql script lying under charts/postgresql/sql_scripts

#### Deploy Orca Service
1. Configure 10orca-service-deployment.yaml and 20orca-service-svc.yaml according to your cluster configurations.
2. Create deployment of Orca Service.
```sh
  kubectl -n argo apply -f 10orca-service-deployment.yaml
```
3. Create service of Orca Service.
```sh
  kubectl -n argo apply -f 20orca-service-svc.yaml
```

#### Deploy Orca
1. Configure 10orca-svc.yaml and 20orca-deployment.yaml according to your cluster configurations.
2. Create service of Orca Frontend.
```sh
  kubectl -n argo apply -f 10orca-svc.yaml
```
3. Create deployment of Orca Service.
```sh
  kubectl -n argo apply -f 20orca-deployment.yaml
```

#### Configure Argo Workflows for Orca Operator template.
1. Please configure ORCA_SERVICE environment variable in orca-operators.yaml.
2. Create Argo Workflows template simply by
```sh
  kubectl -n argo apply -f orca-operators.yaml
```

Keep in mind that the default service account name of Argo Workflows is argo.